import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus, Pencil, Trash2, Star, StarOff, Search, SlidersHorizontal,
  CheckSquare, Square, ChevronDown, X
} from 'lucide-react';
import PetForm from './PetForm';
import ConfirmModal from './ConfirmModal';

const SPECIES_OPTIONS = ['all', 'dog', 'cat', 'rabbit', 'bird', 'other'];
const STATUS_OPTIONS = ['all', 'available', 'pending', 'adopted', 'foster'];
const SIZE_OPTIONS = ['all', 'small', 'medium', 'large', 'extra_large'];

const STATUS_COLORS = {
  available: 'bg-green-600',
  pending: 'bg-amber-500',
  adopted: 'bg-gray-500',
  foster: 'bg-blue-500',
};

export default function PetListingsTab() {
  const queryClient = useQueryClient();

  // Filters & search
  const [search, setSearch] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSize, setFilterSize] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState('all');

  // Bulk selection
  const [selected, setSelected] = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState('');
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  // Pet form
  const [editPet, setEditPet] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Confirm modal
  const [confirmModal, setConfirmModal] = useState(null); // { title, message, onConfirm }

  const { data: pets = [], isLoading } = useQuery({
    queryKey: ['admin-pets'],
    queryFn: () => base44.entities.Pet.list('-created_date', 200),
  });

  const filtered = useMemo(() => {
    return pets.filter(p => {
      if (filterSpecies !== 'all' && p.species !== filterSpecies) return false;
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      if (filterSize !== 'all' && p.size !== filterSize) return false;
      if (filterFeatured === 'featured' && !p.featured) return false;
      if (filterFeatured === 'not_featured' && p.featured) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name?.toLowerCase().includes(q) && !p.breed?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [pets, search, filterSpecies, filterStatus, filterSize, filterFeatured]);

  const activeFilterCount = [
    filterSpecies !== 'all', filterStatus !== 'all',
    filterSize !== 'all', filterFeatured !== 'all'
  ].filter(Boolean).length;

  const allSelected = filtered.length > 0 && filtered.every(p => selected.has(p.id));
  const someSelected = selected.size > 0;

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(p => p.id)));
    }
  };

  const clearFilters = () => {
    setSearch(''); setFilterSpecies('all'); setFilterStatus('all');
    setFilterSize('all'); setFilterFeatured('all');
  };

  // Mutations
  const deletePet = useMutation({
    mutationFn: (id) => base44.entities.Pet.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-pets'] }),
  });

  const toggleFeatured = useMutation({
    mutationFn: ({ id, featured }) => base44.entities.Pet.update(id, { featured }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-pets'] }),
  });

  const bulkUpdateStatus = useMutation({
    mutationFn: async (status) => {
      await Promise.all([...selected].map(id => base44.entities.Pet.update(id, { status })));
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-pets'] }); setSelected(new Set()); setShowBulkMenu(false); },
  });

  const bulkToggleFeatured = useMutation({
    mutationFn: async (featured) => {
      await Promise.all([...selected].map(id => base44.entities.Pet.update(id, { featured })));
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-pets'] }); setSelected(new Set()); setShowBulkMenu(false); },
  });

  const bulkDelete = useMutation({
    mutationFn: async () => {
      await Promise.all([...selected].map(id => base44.entities.Pet.delete(id)));
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-pets'] }); setSelected(new Set()); setShowBulkMenu(false); setConfirmModal(null); },
  });

  const isBulkLoading = bulkUpdateStatus.isPending || bulkToggleFeatured.isPending || bulkDelete.isPending;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-black text-gray-900">
          Pet Listings <span className="text-gray-400 font-normal text-base">({filtered.length} of {pets.length})</span>
        </h2>
        <button
          onClick={() => { setEditPet(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-full text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Pet
        </button>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 mb-5 space-y-3">
        <div className="flex gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or breed…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-full transition-colors">
              <X className="w-3.5 h-3.5" /> Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
            </button>
          )}
        </div>

        {/* Filter row */}
        <div className="flex gap-2 flex-wrap items-center">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />

          <select value={filterSpecies} onChange={e => setFilterSpecies(e.target.value)}
            className={`px-3 py-1.5 border rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-300 ${filterSpecies !== 'all' ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'}`}>
            {SPECIES_OPTIONS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Species' : s.charAt(0).toUpperCase() + s.slice(1) + 's'}</option>)}
          </select>

          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className={`px-3 py-1.5 border rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-300 ${filterStatus !== 'all' ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'}`}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>

          <select value={filterSize} onChange={e => setFilterSize(e.target.value)}
            className={`px-3 py-1.5 border rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-300 ${filterSize !== 'all' ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'}`}>
            {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Sizes' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
          </select>

          <select value={filterFeatured} onChange={e => setFilterFeatured(e.target.value)}
            className={`px-3 py-1.5 border rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-300 ${filterFeatured !== 'all' ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'}`}>
            <option value="all">Featured: All</option>
            <option value="featured">Featured Only</option>
            <option value="not_featured">Not Featured</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {someSelected && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 flex-wrap">
          <span className="text-sm font-bold text-green-800">{selected.size} pet{selected.size > 1 ? 's' : ''} selected</span>
          <div className="flex gap-2 flex-wrap ml-auto">
            {/* Bulk Status */}
            <div className="relative">
              <button
                onClick={() => setShowBulkMenu(p => !p)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 font-semibold text-xs rounded-full hover:bg-gray-50 transition-colors"
              >
                Update Status <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {showBulkMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg ring-1 ring-gray-100 z-20 min-w-36 py-1">
                  {['available', 'pending', 'adopted', 'foster'].map(s => (
                    <button key={s} onClick={() => bulkUpdateStatus.mutate(s)} disabled={isBulkLoading}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 capitalize transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => bulkToggleFeatured.mutate(true)} disabled={isBulkLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 font-semibold text-xs rounded-full hover:bg-amber-100 transition-colors">
              <Star className="w-3.5 h-3.5" /> Feature All
            </button>
            <button onClick={() => bulkToggleFeatured.mutate(false)} disabled={isBulkLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 font-semibold text-xs rounded-full hover:bg-gray-50 transition-colors">
              <StarOff className="w-3.5 h-3.5" /> Unfeature All
            </button>
            <button
              onClick={() => setConfirmModal({
                title: `Delete ${selected.size} pet${selected.size > 1 ? 's' : ''}?`,
                message: `This will permanently remove ${selected.size} pet record${selected.size > 1 ? 's' : ''} from the system. This action cannot be undone.`,
                onConfirm: () => bulkDelete.mutate(),
              })}
              disabled={isBulkLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-600 font-semibold text-xs rounded-full hover:bg-rose-100 transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
            <button onClick={() => setSelected(new Set())} className="px-3 py-1.5 text-gray-400 hover:text-gray-600 text-xs font-semibold">
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Pet Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
              <div className="h-36 bg-gray-200" />
              <div className="p-4 space-y-2"><div className="h-4 bg-gray-200 rounded w-1/2" /><div className="h-3 bg-gray-100 rounded w-3/4" /></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-semibold">No pets match your filters</p>
          <button onClick={clearFilters} className="mt-2 text-sm text-green-600 hover:underline">Clear all filters</button>
        </div>
      ) : (
        <>
          {/* Select All */}
          <div className="flex items-center gap-2 mb-3">
            <button onClick={toggleSelectAll} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors">
              {allSelected ? <CheckSquare className="w-4 h-4 text-green-600" /> : <Square className="w-4 h-4" />}
              {allSelected ? 'Deselect All' : `Select All (${filtered.length})`}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(pet => {
              const isSelected = selected.has(pet.id);
              return (
                <div key={pet.id} className={`bg-white rounded-xl overflow-hidden shadow-sm ring-1 transition-all ${isSelected ? 'ring-green-400 ring-2' : 'ring-gray-100'}`}>
                  <div className="relative">
                    <img
                      src={pet.photo_url || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=60'}
                      alt={pet.name}
                      className="w-full h-36 object-cover"
                    />
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleSelect(pet.id)}
                      className={`absolute top-2 left-2 w-6 h-6 rounded-md flex items-center justify-center transition-all shadow ${isSelected ? 'bg-green-600 text-white' : 'bg-white/90 text-gray-400 hover:text-green-600'}`}
                    >
                      {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    </button>
                    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold text-white ${STATUS_COLORS[pet.status] || 'bg-gray-500'}`}>
                      {pet.status}
                    </div>
                    {pet.featured && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-current" /> Featured
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">{pet.name}</h3>
                        <p className="text-xs text-gray-500">{pet.breed || pet.species} • {pet.sex} {pet.size && `• ${pet.size}`}</p>
                        {pet.adoption_fee && <p className="text-xs text-green-700 font-semibold mt-0.5">${pet.adoption_fee} adoption fee</p>}
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => toggleFeatured.mutate({ id: pet.id, featured: !pet.featured })}
                          className={`p-1.5 rounded-lg transition-colors ${pet.featured ? 'text-amber-500 bg-amber-50' : 'text-gray-300 hover:text-amber-400'}`}
                          title="Toggle featured"
                        >
                          {pet.featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => { setEditPet(pet); setShowForm(true); }}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                        onClick={() => setConfirmModal({
                          title: `Delete ${pet.name}?`,
                          message: `This will permanently remove ${pet.name} from the shelter listings. This action cannot be undone.`,
                          onConfirm: () => deletePet.mutate(pet.id),
                        })}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                        <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {showForm && (
        <PetForm
          pet={editPet}
          onClose={() => { setShowForm(false); setEditPet(null); }}
          onSaved={() => {}}
        />
      )}
    </div>
  );
}