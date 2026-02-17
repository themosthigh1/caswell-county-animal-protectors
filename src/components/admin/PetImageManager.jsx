import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, Trash2, ArrowLeft, ArrowRight, Star, Loader2 } from 'lucide-react';

export default function PetImageManager({ pet }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  // Collect all images: primary first, then extras
  const primaryUrl = pet.photo_url || null;
  const extraUrls = pet.photo_urls || [];
  const allImages = [
    ...(primaryUrl ? [primaryUrl] : []),
    ...extraUrls,
  ];

  const savePet = useMutation({
    mutationFn: (data) => base44.entities.Pet.update(pet.id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pet', pet.id] }),
  });

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const uploaded = await Promise.all(
      files.map(f => base44.integrations.Core.UploadFile({ file: f }).then(r => r.file_url))
    );
    const newUrls = [...allImages, ...uploaded];
    await savePet.mutateAsync({
      photo_url: newUrls[0] || null,
      photo_urls: newUrls.slice(1),
    });
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (index) => {
    const newUrls = allImages.filter((_, i) => i !== index);
    await savePet.mutateAsync({
      photo_url: newUrls[0] || null,
      photo_urls: newUrls.slice(1),
    });
  };

  const handleMove = async (index, direction) => {
    const newUrls = [...allImages];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= newUrls.length) return;
    [newUrls[index], newUrls[swapIndex]] = [newUrls[swapIndex], newUrls[index]];
    await savePet.mutateAsync({
      photo_url: newUrls[0] || null,
      photo_urls: newUrls.slice(1),
    });
  };

  const handleSetPrimary = async (index) => {
    if (index === 0) return;
    const newUrls = [...allImages];
    const [moved] = newUrls.splice(index, 1);
    newUrls.unshift(moved);
    await savePet.mutateAsync({
      photo_url: newUrls[0] || null,
      photo_urls: newUrls.slice(1),
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 text-sm">Photo Management</h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-600 disabled:opacity-60 text-white font-semibold text-xs px-4 py-2 rounded-full transition-colors"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {uploading ? 'Uploading…' : 'Add Photos'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {allImages.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl h-32 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-green-300 hover:text-green-500 transition-colors"
        >
          <Upload className="w-7 h-7 mb-1.5" />
          <span className="text-sm font-medium">Click to upload photos</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {allImages.map((url, i) => (
            <div key={url + i} className={`relative group rounded-xl overflow-hidden aspect-square ring-2 ${i === 0 ? 'ring-amber-400' : 'ring-transparent'}`}>
              <img src={url} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <div className="absolute top-1.5 left-1.5 bg-amber-400 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-current" /> Primary
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                {i !== 0 && (
                  <button
                    onClick={() => handleSetPrimary(i)}
                    disabled={savePet.isPending}
                    title="Set as primary"
                    className="w-7 h-7 bg-amber-400 hover:bg-amber-500 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => handleMove(i, -1)}
                  disabled={savePet.isPending || i === 0}
                  title="Move left"
                  className="w-7 h-7 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center disabled:opacity-30 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMove(i, 1)}
                  disabled={savePet.isPending || i === allImages.length - 1}
                  title="Move right"
                  className="w-7 h-7 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center disabled:opacity-30 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(i)}
                  disabled={savePet.isPending}
                  title="Delete photo"
                  className="w-7 h-7 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-3">First image is shown as the primary photo. Hover over images to reorder or delete.</p>
    </div>
  );
}