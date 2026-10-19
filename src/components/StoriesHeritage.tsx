import React, { useState } from 'react';
import { ArtisanStory } from '../types/catalogue.ts';
import {
  BookOpen,
  Sparkles,
  MapPin,
  User,
  Layers,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Feather,
  Globe,
} from 'lucide-react';

interface StoriesHeritageProps {
  stories: ArtisanStory[];
  onSaveStory: (story: ArtisanStory) => void;
}

export const StoriesHeritage: React.FC<StoriesHeritageProps> = ({
  stories,
  onSaveStory,
}) => {
  const [artisanName, setArtisanName] = useState('Sushila Baghel');
  const [craftName, setCraftName] = useState('Bastar Dhokra Lost-Wax Bell Metal Casting');
  const [location, setLocation] = useState('Kondagaon, Bastar, Chhattisgarh');
  const [materialsTechniques, setMaterialsTechniques] = useState(
    'Beeswax wire drafting, river clay mold, bronze and brass scrap alloy, wood fire pit furnace'
  );
  const [storyText, setStoryText] = useState(
    'I learned Dhokra casting watching my mother wind delicate beeswax threads around clay cores when I was seven. Each figurine takes nearly two weeks of hand-work, melting the wax out in the open pit furnace so the molten brass can take its place. Our art reflects the deer, birds, and forest deities of Bastar.'
  );
  const [language, setLanguage] = useState('English');
  const [isRefining, setIsRefining] = useState(false);
  const [refinedStory, setRefinedStory] = useState<string | null>(null);
  const [keyHighlights, setKeyHighlights] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRefineStory = async () => {
    if (!storyText.trim() || !artisanName.trim()) {
      setErrorMessage('Please provide your name and draft story first.');
      return;
    }

    setIsRefining(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/artisan/refine-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artisan_name: artisanName,
          craft_name: craftName,
          location,
          materials_techniques: materialsTechniques,
          story_text: storyText,
          language,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to refine story.');
      }

      setRefinedStory(json.data.refined_story);
      setKeyHighlights(json.data.key_highlights || []);
    } catch (err: any) {
      console.error('Story refinement error:', err);
      setErrorMessage(err.message || 'Error communicating with Gemini AI.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleApplyRefined = () => {
    if (refinedStory) {
      setStoryText(refinedStory);
      setRefinedStory(null);
    }
  };

  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();
    const newStory: ArtisanStory = {
      id: `story-${Date.now()}`,
      artisan_name: artisanName,
      craft_name: craftName,
      location,
      materials_techniques: materialsTechniques,
      story_text: storyText,
      language,
      is_ai_refined: keyHighlights.length > 0,
      created_at: new Date().toISOString(),
    };

    onSaveStory(newStory);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#123F32] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#24664D]/40">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📜</span>
            <span className="text-xs font-semibold bg-[#24664D] text-amber-200 border border-amber-300/30 px-3 py-1 rounded-full uppercase tracking-wider">
              Stories & Heritage
            </span>
            <span className="text-xs bg-white/10 text-white/90 px-2.5 py-0.5 rounded-full border border-white/20">
              Preserving Authentic Oral Histories
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-2 text-[#F8F5EF]">
            Artisan Story & Craft Lineage
          </h2>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            Buyers around the world don't just buy a craft—they cherish the human soul behind it. Share your personal journey, indigenous techniques, and ancestral memories in your own authentic words.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Story Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8E1D7] p-6 sm:p-8 shadow-xs">
          <div className="pb-4 mb-6 border-b border-[#E8E1D7] flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#242720]">Craft Your Heritage Story</h3>
              <p className="text-xs text-[#6F716A]">
                AI only polishes phrasing and formatting. Your facts, location, and lineage remain strictly your own.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveStory} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                  Artisan / Guild Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={artisanName}
                    onChange={(e) => setArtisanName(e.target.value)}
                    placeholder="e.g., Sushila Baghel"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E1D7] text-sm font-medium bg-[#F8F5EF]/60"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                  Craft Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={craftName}
                  onChange={(e) => setCraftName(e.target.value)}
                  placeholder="e.g., Dhokra Lost-Wax Casting"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1D7] text-sm font-medium bg-[#F8F5EF]/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                  Artisan Village, District & State
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#C45D3A] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Kondagaon, Bastar, Chhattisgarh"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E1D7] text-sm font-medium bg-[#F8F5EF]/60"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                  Language Preference
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E1D7] text-sm font-medium bg-white"
                >
                  <option value="English">English (Global Market)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Bengali">Bengali (বাংলা)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Rajasthani / Marwari">Rajasthani / Marwari</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#242720] mb-1.5">
                Authentic Materials & Traditional Techniques Used
              </label>
              <input
                type="text"
                value={materialsTechniques}
                onChange={(e) => setMaterialsTechniques(e.target.value)}
                placeholder="e.g., Handloom pit loom, fermented indigo vats, beeswax coils"
                className="w-full px-3 py-2 rounded-xl border border-[#E8E1D7] text-sm font-medium bg-[#F8F5EF]/60"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-bold uppercase tracking-wider text-[#242720]">
                  Your Personal Journey & Ancestral Story <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleRefineStory}
                  disabled={isRefining || !storyText.trim()}
                  className="text-xs text-[#123F32] hover:text-[#24664D] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isRefining ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C45D3A]" />
                      <span>Refining with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#C45D3A]" />
                      <span>Refine Clarity with AI</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                rows={5}
                required
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder="Write in your own voice about how you learned the craft, what the motifs signify, and your hopes for the next generation..."
                className="w-full px-4 py-3 rounded-xl border border-[#E8E1D7] text-sm leading-relaxed bg-[#F8F5EF]/40 font-serif"
              />
            </div>

            {/* AI Refinement Proposal Box */}
            {refinedStory && (
              <div className="p-4 bg-amber-50/90 border border-amber-300 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#123F32] flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-4 h-4 text-[#C45D3A]" />
                    <span>Gemini Refined Editorial Draft (Preview)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleApplyRefined}
                    className="px-3 py-1 rounded-lg bg-[#123F32] hover:bg-[#24664D] text-white text-xs font-semibold cursor-pointer"
                  >
                    Use Refined Draft
                  </button>
                </div>
                <p className="text-xs text-[#242720] leading-relaxed font-serif whitespace-pre-line bg-white/80 p-3 rounded-lg border border-amber-200">
                  {refinedStory}
                </p>
                {keyHighlights.length > 0 && (
                  <div>
                    <span className="font-bold text-[#242720] text-[11px] block mb-1">
                      Verified Highlights Extracted:
                    </span>
                    <ul className="list-disc list-inside text-[11px] text-[#6F716A] space-y-0.5">
                      {keyHighlights.map((hl, i) => (
                        <li key={i}>{hl}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Artisan story successfully published and added to community heritage records!</span>
              </div>
            )}

            <div className="pt-3 border-t border-[#E8E1D7] flex items-center justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#123F32] hover:bg-[#24664D] text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>Publish Artisan Story</span>
              </button>
            </div>
          </form>
        </div>

        {/* Stories Showcase */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-[#242720] text-base">Published Heritage Stories</h4>
            <span className="text-xs text-[#6F716A]">{stories.length} stories recorded</span>
          </div>

          <div className="space-y-4">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-2xl border border-[#E8E1D7] p-5 shadow-2xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-serif font-bold text-[#242720] text-base">{story.artisan_name}</h5>
                    <p className="text-xs text-[#C45D3A] font-medium">{story.craft_name}</p>
                  </div>
                  {story.is_ai_refined && (
                    <span className="text-[10px] font-bold bg-[#F8F5EF] text-[#123F32] border border-[#E8E1D7] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#C45D3A]" /> AI Polished
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#6F716A] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C45D3A] shrink-0" />
                  <span>{story.location}</span>
                </div>

                <p className="text-xs text-[#242720] font-serif leading-relaxed line-clamp-4 italic bg-[#F8F5EF] p-3 rounded-xl border border-[#E8E1D7]">
                  "{story.story_text}"
                </p>

                <div className="text-[11px] text-[#6F716A] pt-2 border-t border-[#E8E1D7]/60 flex items-center justify-between">
                  <span>Materials: {story.materials_techniques}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
