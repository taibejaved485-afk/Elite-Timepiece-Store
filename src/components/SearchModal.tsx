import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Clock,
  ArrowRight,
  BookOpen,
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react';
import { Watch, PageRoute, CurrencyCode } from '../types/watch';
import { WATCHES } from '../data/watches';
import { handleImageFallback } from '../utils/imageFallback';
import { getWatchImageAlt } from '../utils/imageSeo';
import { formatPrice } from '../utils/currency';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageRoute) => void;
  currency?: CurrencyCode;
}

const SEARCH_ARTICLES = [
  {
    id: 'art-1',
    title: 'The Evolution of Free-Sprung Balance Wheels',
    category: 'Horological Engineering',
    date: 'October 2026',
    image: '/assets/images/watch_skeleton_tourbillon_1791612558576.jpg',
  },
  {
    id: 'art-2',
    title: 'Architecture of Le Brassus: Glass & Titanium',
    category: 'Manufacture Architecture',
    date: 'September 2026',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    fallbackImage: '/assets/images/hero_luxury_chronograph_1791612522214.jpg',
  },
  {
    id: 'art-3',
    title: 'The Mastery of Internal Anglage Chamfering',
    category: 'Métiers d’Art Finishing',
    date: 'August 2026',
    image: '/assets/images/craftsmanship_watchmaker_1791612587562.jpg',
  },
];

const VOICE_SEARCH_IDEAS = [
  'Skeleton Tourbillon',
  'Rose Gold Chronograph',
  'Abyss Diver 300M',
  'Minimalist Dress Watch',
  'Heritage Classics',
  'Grade 5 Titanium',
];

/**
 * Filter watches based on search query matching name, collection, reference, metals, dial, and calibres
 */
function getMatchingWatches(queryText: string): Watch[] {
  if (!queryText.trim()) return [];
  const lowerQuery = queryText.toLowerCase().trim();
  const searchTerms = lowerQuery.split(/\s+/).filter(Boolean);

  return WATCHES.filter((w) => {
    const searchTarget = [
      w.name,
      w.collection,
      w.reference,
      w.tagline,
      w.description,
      w.specs?.caseMaterial,
      w.specs?.dialColor,
      w.specs?.movement,
      w.specs?.calibre,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return (
      searchTarget.includes(lowerQuery) ||
      searchTerms.every((term) => searchTarget.includes(term))
    );
  });
}

/**
 * Filter journal articles based on query
 */
function getMatchingArticles(queryText: string) {
  if (!queryText.trim()) return [];
  const lowerQuery = queryText.toLowerCase().trim();
  return SEARCH_ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(lowerQuery) ||
      a.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Generate a luxury, conversational text-to-speech summary of search results
 */
function buildTTSFeedback(
  queryText: string,
  watches: Watch[],
  articles: Array<{ title: string; category: string }>,
  currencyCode: CurrencyCode = 'USD'
): string {
  if (watches.length === 0 && articles.length === 0) {
    return `No timepieces found for ${queryText}. Try searching for Tourbillon, Diver, or Chronograph.`;
  }

  const parts: string[] = [];
  if (watches.length > 0) {
    const top = watches[0];
    const priceStr = formatPrice(top.priceUSD, currencyCode);

    if (watches.length === 1) {
      parts.push(
        `Found 1 timepiece matching your request: the ${top.name} in ${top.specs.caseMaterial}, priced at ${priceStr}.`
      );
    } else {
      parts.push(
        `Found ${watches.length} timepieces. Top match is the ${top.name} in ${top.specs.caseMaterial}, priced at ${priceStr}.`
      );
      if (watches.length > 1) {
        const second = watches[1];
        parts.push(`Also available: ${second.name}.`);
      }
    }
  }

  if (articles.length > 0 && watches.length === 0) {
    parts.push(
      `Found ${articles.length} journal articles. Top article: ${articles[0].title}.`
    );
  }

  return parts.join(' ');
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  currency = 'USD',
}) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState<string | null>(null);

  // Text-To-Speech (TTS) State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTTSMuted, setIsTTSMuted] = useState(false);
  const [currentSpokenText, setCurrentSpokenText] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wasVoiceTriggeredRef = useRef(false);
  const latestFinalTranscriptRef = useRef('');

  useEffect(() => {
    const saved = localStorage.getItem('aurelia_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Detect Web Speech API availability
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setSpeechSupported(Boolean(SpeechRecognition));
    }
  }, []);

  // Stop active speech recognition & speech synthesis when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (isListening) stopListening();
      stopSpeaking();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      stopSpeaking();
    };
  }, []);

  const addToRecent = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('aurelia_recent_searches', JSON.stringify(updated));
    } catch (e) {}
  };

  /**
   * Text-To-Speech (TTS) Execution using window.speechSynthesis
   */
  const speakResults = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isTTSMuted) return;

    try {
      window.speechSynthesis.cancel(); // Stop any currently playing audio

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Refined luxury pacing
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      // Select preferred natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Samantha') ||
              v.name.includes('Daniel') ||
              v.name.includes('Serena') ||
              v.name.includes('Karen'))
        ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentSpokenText(text);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        console.warn('TTS playback issue:', e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Failed to speak text-to-speech summary', err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    setIsSpeaking(false);
  };

  /**
   * Voice Command Processing via SpeechRecognition
   */
  const startListening = () => {
    // If speaking, stop TTS first so microphone doesn't hear itself
    stopSpeaking();

    if (!speechSupported) {
      setSpeechFeedback('Voice search is not supported in this browser. Please use Google Chrome, Edge, or Safari.');
      setTimeout(() => setSpeechFeedback(null), 4000);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      wasVoiceTriggeredRef.current = true;
      latestFinalTranscriptRef.current = '';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechFeedback('Listening... Speak a timepiece model, collection, or metal style');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const recognizedText = (final || interim).trim();
        if (recognizedText) {
          setQuery(recognizedText);
          setSpeechFeedback(`Recognized: "${recognizedText}"`);
        }

        if (final) {
          latestFinalTranscriptRef.current = final.trim();
          addToRecent(final.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        wasVoiceTriggeredRef.current = false;

        if (event.error === 'not-allowed') {
          setSpeechFeedback('Microphone permission denied. Please allow microphone access in your browser.');
        } else if (event.error === 'no-speech') {
          setSpeechFeedback('No speech detected. Tap microphone to speak again.');
        } else if (event.error === 'network') {
          setSpeechFeedback('Network connection issue during speech recognition.');
        } else {
          setSpeechFeedback('Voice recognition ended. Tap mic to retry.');
        }
        setTimeout(() => setSpeechFeedback(null), 3500);
      };

      recognition.onend = () => {
        setIsListening(false);

        const finalSpokenQuery = (latestFinalTranscriptRef.current || query).trim();

        // When a voice command is successfully processed, read out the top search results
        if (wasVoiceTriggeredRef.current && finalSpokenQuery) {
          const matchingWatches = getMatchingWatches(finalSpokenQuery);
          const matchingArticles = getMatchingArticles(finalSpokenQuery);
          const ttsSummary = buildTTSFeedback(
            finalSpokenQuery,
            matchingWatches,
            matchingArticles,
            currency
          );

          setSpeechFeedback(`Processed: "${finalSpokenQuery}"`);
          setCurrentSpokenText(ttsSummary);

          // Trigger Text-to-Speech audio feedback readout
          setTimeout(() => {
            speakResults(ttsSummary);
          }, 300);
        }

        wasVoiceTriggeredRef.current = false;
        setTimeout(() => setSpeechFeedback(null), 3000);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to initialize speech recognition', err);
      setIsListening(false);
      wasVoiceTriggeredRef.current = false;
      setSpeechFeedback('Microphone could not be activated.');
      setTimeout(() => setSpeechFeedback(null), 3000);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  // Live filter matching
  const filteredItems = useMemo(() => getMatchingWatches(query), [query]);
  const filteredArticles = useMemo(() => getMatchingArticles(query), [query]);
  const hasResults = filteredItems.length > 0 || filteredArticles.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-start justify-center pt-6 sm:pt-20 px-3 sm:px-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="w-full max-w-lg max-h-[88dvh] flex flex-col bg-[#0A0D14] border border-[#C5A059]/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar with Web Speech & Audio Readout Controls */}
            <div className="relative mb-3 shrink-0">
              <Search className="w-5 h-5 text-[#C5A059] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                autoFocus
                placeholder="Search models, styles, calibres, or speak..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query.trim()) {
                    addToRecent(query.trim());
                  }
                }}
                className="w-full pl-12 pr-28 py-4 bg-[#161922] border border-[#C5A059]/20 focus:border-[#C5A059] rounded-2xl text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner text-sm"
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {/* TTS Audio Readout / Mute Toggle Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeaking();
                    } else if (currentSpokenText) {
                      speakResults(currentSpokenText);
                    } else if (query.trim()) {
                      const text = buildTTSFeedback(query, filteredItems, filteredArticles, currency);
                      setCurrentSpokenText(text);
                      speakResults(text);
                    } else {
                      setIsTTSMuted(!isTTSMuted);
                    }
                  }}
                  className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                    isSpeaking
                      ? 'bg-[#C5A059] text-black shadow-[0_0_15px_rgba(197,160,89,0.5)] animate-pulse'
                      : isTTSMuted
                      ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                      : 'text-[#C5A059]/75 hover:text-[#C5A059] hover:bg-[#C5A059]/10'
                  }`}
                  title={
                    isSpeaking
                      ? 'Reading results aloud. Tap to stop audio feedback.'
                      : isTTSMuted
                      ? 'Voice readout muted. Tap to unmute.'
                      : 'Audio readout active. Tap to read out top results.'
                  }
                  aria-label={isSpeaking ? 'Stop audio readout' : 'Text-to-speech audio feedback'}
                >
                  {isTTSMuted ? (
                    <VolumeX className="w-4 h-4 text-slate-500" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                {/* Web Speech API Microphone Button */}
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`p-2 rounded-xl transition-all duration-300 relative group cursor-pointer ${
                    isListening
                      ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] ring-2 ring-rose-400/50'
                      : speechSupported
                      ? 'text-[#C5A059]/75 hover:text-[#C5A059] hover:bg-[#C5A059]/10'
                      : 'text-slate-600 cursor-not-allowed opacity-50'
                  }`}
                  title={
                    !speechSupported
                      ? 'Web Speech API not supported in this browser'
                      : isListening
                      ? 'Stop voice recognition'
                      : 'Speak watch model, metal, or style'
                  }
                  aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
                >
                  {isListening ? (
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                    >
                      <Mic className="w-4 h-4 text-white" />
                    </motion.div>
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}

                  {isListening && (
                    <span className="absolute -inset-1 rounded-xl bg-rose-500/30 animate-ping pointer-events-none" />
                  )}
                </button>

                {/* Clear search or close button */}
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      stopSpeaking();
                      if (inputRef.current) inputRef.current.focus();
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Clear search input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Close search modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Live Audio Speech Status / TTS Readout Bar */}
            <AnimatePresence>
              {(isListening || isSpeaking || speechFeedback) && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -6 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -6 }}
                  className="mb-3.5 overflow-hidden shrink-0"
                >
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                      isListening
                        ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                        : isSpeaking
                        ? 'bg-[#C5A059]/20 border-[#C5A059]/50 text-[#F5E6C4]'
                        : 'bg-[#C5A059]/10 border-[#C5A059]/30 text-[#E2C775]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isListening ? (
                        <div className="flex items-center gap-1 shrink-0">
                          {[0.4, 0.8, 1.2, 0.6].map((dur, i) => (
                            <motion.span
                              key={i}
                              animate={{ height: ['4px', '16px', '6px'] }}
                              transition={{ repeat: Infinity, duration: dur, ease: 'easeInOut' }}
                              className="w-1 bg-rose-400 rounded-full"
                            />
                          ))}
                        </div>
                      ) : isSpeaking ? (
                        <div className="flex items-center gap-1 shrink-0">
                          {[0.5, 0.9, 0.4, 1.1].map((dur, i) => (
                            <motion.span
                              key={i}
                              animate={{ height: ['4px', '15px', '5px'] }}
                              transition={{ repeat: Infinity, duration: dur, ease: 'easeInOut' }}
                              className="w-1 bg-[#C5A059] rounded-full"
                            />
                          ))}
                        </div>
                      ) : (
                        <Volume2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                      )}

                      <span className="truncate font-medium">
                        {isSpeaking
                          ? 'Reading out top matches aloud...'
                          : speechFeedback || 'Listening for watch model or style...'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isSpeaking && (
                        <button
                          type="button"
                          onClick={stopSpeaking}
                          className="px-2 py-0.5 rounded-md bg-[#C5A059] text-black text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer"
                        >
                          Stop Voice
                        </button>
                      )}

                      {isListening && (
                        <button
                          type="button"
                          onClick={stopListening}
                          className="px-2 py-0.5 rounded-md bg-rose-500/30 hover:bg-rose-500/50 text-rose-200 text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer"
                        >
                          Done
                        </button>
                      )}

                      {!isSpeaking && !isListening && currentSpokenText && (
                        <button
                          type="button"
                          onClick={() => speakResults(currentSpokenText)}
                          className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer"
                          title="Replay text-to-speech feedback"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Replay</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results or Suggestion Views */}
            {query ? (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
                {/* Watches Results */}
                {filteredItems.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-semibold">
                        Timepieces ({filteredItems.length})
                      </p>
                      {currentSpokenText && !isSpeaking && (
                        <button
                          type="button"
                          onClick={() => speakResults(currentSpokenText)}
                          className="text-[10px] text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Hear Summary</span>
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {filteredItems.map((watch, idx) => (
                        <button
                          key={watch.id}
                          onClick={() => {
                            stopSpeaking();
                            addToRecent(watch.name);
                            onNavigate(`product-${watch.id}` as PageRoute);
                            onClose();
                          }}
                          className={`w-full p-3 flex items-center gap-4 bg-[#161922] hover:bg-[#C5A059]/10 border transition-all text-left group cursor-pointer rounded-2xl ${
                            idx === 0
                              ? 'border-[#C5A059]/40 shadow-[0_0_15px_rgba(197,160,89,0.12)]'
                              : 'border-transparent hover:border-[#C5A059]/30'
                          }`}
                        >
                          <img
                            src={watch.image}
                            alt={getWatchImageAlt(watch, 'thumbnail')}
                            onError={handleImageFallback}
                            className="w-12 h-12 object-cover rounded-xl shadow-lg shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white group-hover:text-[#C5A059] transition-colors truncate">
                                {watch.name}
                              </h4>
                              {idx === 0 && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#C5A059]/20 text-[#E2C775] border border-[#C5A059]/40 shrink-0 uppercase tracking-wider">
                                  Top Match
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                              {watch.collection} · Ref {watch.reference} · {watch.specs.caseMaterial}
                            </p>
                            <span className="text-xs font-mono font-bold text-[#E2C775] mt-0.5 block">
                              {formatPrice(watch.priceUSD, currency)}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#C5A059]/40 group-hover:text-[#C5A059] transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Journal Articles Results */}
                {filteredArticles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-semibold">
                      Journal Articles ({filteredArticles.length})
                    </p>
                    <div className="space-y-2">
                      {filteredArticles.map((art) => (
                        <button
                          key={art.id}
                          onClick={() => {
                            stopSpeaking();
                            addToRecent(art.title);
                            onNavigate(`article-${art.id}` as PageRoute);
                            onClose();
                          }}
                          className="w-full p-3 flex items-center gap-4 bg-[#161922] hover:bg-[#C5A059]/10 border border-transparent hover:border-[#C5A059]/30 rounded-2xl transition-all text-left group cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center shrink-0 text-[#C5A059]">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white group-hover:text-[#C5A059] transition-colors truncate">
                              {art.title}
                            </h4>
                            <p className="text-[10px] text-[#C5A059] uppercase tracking-wider">
                              {art.category} · {art.date}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#C5A059]/40 group-hover:text-[#C5A059] transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!hasResults && (
                  <div className="text-center py-8 space-y-2">
                    <p className="text-slate-300 text-sm font-medium">
                      No matching timepieces or journal entries found.
                    </p>
                    <p className="text-slate-500 text-xs">
                      Try speaking or searching by complication (e.g. &ldquo;Tourbillon&rdquo;), collection (e.g. &ldquo;Chronograph&rdquo;), or metal (e.g. &ldquo;Rose Gold&rdquo;).
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5 overflow-y-auto pr-1">
                {/* Voice Search Quick Suggestions */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#C5A059] font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Popular Voice Queries</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {VOICE_SEARCH_IDEAS.map((idea) => (
                      <button
                        key={idea}
                        type="button"
                        onClick={() => {
                          setQuery(idea);
                          addToRecent(idea);
                          const matches = getMatchingWatches(idea);
                          const articleMatches = getMatchingArticles(idea);
                          const readout = buildTTSFeedback(idea, matches, articleMatches, currency);
                          setCurrentSpokenText(readout);
                          speakResults(readout);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#161922] hover:bg-[#C5A059]/15 border border-slate-800 hover:border-[#C5A059]/40 text-xs text-slate-300 hover:text-[#E2C775] transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Mic className="w-3 h-3 text-[#C5A059]/70" />
                        <span>{idea}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                        Recent Searches
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setRecentSearches([]);
                          localStorage.removeItem('aurelia_recent_searches');
                        }}
                        className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => setQuery(term)}
                        className="w-full flex items-center gap-3 text-slate-300 hover:text-[#C5A059] transition-colors text-sm py-1.5 group text-left cursor-pointer"
                      >
                        <Clock className="w-4 h-4 text-slate-500 group-hover:text-[#C5A059] transition-colors shrink-0" />
                        <span className="truncate">{term}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
