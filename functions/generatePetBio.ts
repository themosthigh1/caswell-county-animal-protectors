import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, species, breed, age_years, age_months, sex, size, color, temperament,
      good_with_kids, good_with_dogs, good_with_cats, vaccinated, spayed_neutered,
      microchipped, special_needs, special_needs_description } = await req.json();

    const age = age_years
      ? `${age_years} year${age_years !== 1 ? 's' : ''}${age_months ? ` and ${age_months} months` : ''}`
      : age_months ? `${age_months} months` : 'unknown age';

    const traits = [
      good_with_kids && 'good with kids',
      good_with_dogs && 'good with dogs',
      good_with_cats && 'good with cats',
      vaccinated && 'vaccinated',
      spayed_neutered && 'spayed/neutered',
      microchipped && 'microchipped',
    ].filter(Boolean).join(', ');

    const prompt = `Write a warm, engaging, and heartfelt adoption bio for a shelter pet with the following details:
- Name: ${name}
- Species: ${species}
- Breed: ${breed || 'Mixed breed'}
- Age: ${age}
- Sex: ${sex}
- Size: ${size || 'unknown'}
- Color: ${color || 'unknown'}
- Temperament notes: ${temperament || 'none provided'}
- Traits: ${traits || 'none listed'}
${special_needs ? `- Special needs: ${special_needs_description || 'yes'}` : ''}

Write 2-3 short paragraphs that will make potential adopters fall in love. Use a friendly, conversational tone. Focus on personality and what life with this pet would be like. Do NOT use bullet points. Do NOT include the pet's name in every sentence. Keep it under 200 words.`;

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 400 }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: data?.error?.message || 'Gemini API error', detail: data }, { status: 500 });
    }

    const bio = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!bio) return Response.json({ error: 'No bio returned', detail: data }, { status: 500 });

    return Response.json({ bio });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});