import React, { useState, useEffect, useRef } from 'react';
import { Compass, ShieldCheck, Zap, Volume2, VolumeX, Play, Pause, Award, ArrowRight, Sparkles } from 'lucide-react';
import { PageRoute } from '../types/watch';

interface ComponentDetail {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  specs: string;
  origin: string;
}

interface CraftsmanshipPageProps {
  onNavigate?: (page: PageRoute) => void;
}

const COMPONENTS: ComponentDetail[] = [
  {
    id: 'balance-wheel',
    name: 'Free-Sprung Variable Inertia Balance',
    subtitle: 'The Heart of Mechanical Chronometry',
    description: 'Oscillating back and forth with mathematical perfection, our balance wheel incorporates four gold micro-screws along its rim. This allows master watchmakers to poise and regulate the rate without disturbing the sensitive Breguet overcoil terminal curve, eliminating rate fluctuations across temperature variations.',
    specs: 'Adjusted in 5 spatial positions & 3 temperatures (-5°C, 20°C, 40°C)',
    origin: 'Hand-assembled in Atelier Le Brassus',
  },
  {
    id: 'flying-tourbillon',
    name: '60-Second Flying Tourbillon Cage',
    subtitle: 'Defying the Forces of Gravity',
    description: 'Invented to neutralize positional gravitational errors on the escapement. Unlike traditional caged tourbillons with upper bridges, our flying variant is supported entirely from below, offering unobstructed viewing of the escapement floating in mid-air. Crafted from ultralight Grade 5 titanium, the entire carriage weighs merely 0.28 grams.',
    specs: 'Weight: 0.28g · Rotation: 1 full cycle per 60 seconds · Titanium Grade 5',
    origin: 'Poinçon de Genève Certified',
  },
  {
    id: 'gold-rotor',
    name: 'Bi-Directional 22k Solid Gold Rotor',
    subtitle: 'Kinetic Energy Stored Through Daily Motion',
    description: 'A heavy 22k gold oscillating weight harnesses the wearer’s natural wrist gestures to wind the mainspring barrel through ceramic ball bearings. The dense atomic mass of 22k gold delivers 35% higher inertia than tungsten, ensuring rapid power replenishment even during sedentary activity.',
    specs: '22k Gold (91.6% purity) · Sunburst Circular Graining · Ceramic Bearings',
    origin: 'Engraved with the Aurelia Coat of Arms',
  },
  {
    id: 'anglage',
    name: 'Hand Anglage & Côtes de Genève Finishing',
    subtitle: 'Centuries of Artisanal Geneva Decoration',
    description: 'Every bridge and plate is decorated entirely by human hand. Using gentian wood pegs dressed with diamond lapping paste, artisans spend up to 40 hours mirror-polishing internal angles until they reflect light like liquid silver. The surface is adorned with rhythmic Côtes de Genève linear wave graining.',
    specs: '100% Hand-Chamfered · 45° Internal Mirror Angles · No Machine Finishing',
    origin: 'Preserved 1892 Swiss Tradition',
  },
  {
    id: 'rubies',
    name: 'Synthetic Corundum Ruby Bearings',
    subtitle: 'Frictionless Mechanical Immortality',
    description: 'Machined synthetic rubies (corundum, hardness 9 on Mohs scale) serve as low-friction pivot bearings for high-speed pinion arbors. Lubricated with microscopic micro-droplets of synthetic Swiss Moebius oil, they guarantee our movements run continuously for decades with negligible mechanical wear.',
    specs: 'Hardness: 9 Mohs · Polished Oil Cups · Endstones with Kif Shock Absorbers',
    origin: 'Swiss Gemmological Standards',
  },
];

export const CraftsmanshipPage: React.FC<CraftsmanshipPageProps> = ({ onNavigate }) => {
  const [selectedComp, setSelectedComp] = useState<ComponentDetail>(COMPONENTS[0]);
  const [activeFrequency, setActiveFrequency] = useState<number>(28800); // 28,800 vph
  const [isPlayingSound, setIsPlayingSound] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioIntervalRef = useRef<number | null>(null);

  // Audio tick sound synthesis
  useEffect(() => {
    if (!isPlayingSound) {
      if (audioIntervalRef.current) {
        window.clearInterval(audioIntervalRef.current);
        audioIntervalRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const beatsPerSecond = activeFrequency / 3600;
      const intervalMs = 1000 / beatsPerSecond;

      audioIntervalRef.current = window.setInterval(() => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(3200 + Math.random() * 400, ctx.currentTime);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.02);
        } catch (e) {
          // ignore audio interruptions
        }
      }, intervalMs);
    } catch (e) {
      // Audio not supported
    }

    return () => {
      if (audioIntervalRef.current) {
        window.clearInterval(audioIntervalRef.current);
      }
    };
  }, [isPlayingSound, activeFrequency]);

  const toggleSound = () => {
    setIsPlayingSound(!isPlayingSound);
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-12 space-y-20">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-medium">
          Haute Horlogerie Manufacturing
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-white tracking-tight">
          The Soul of Mechanical Calibres
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          A purely mechanical watch is a living organism governed by microscopic inertia, friction, and balance. In our Le Brassus manufacture, master horologists spend lifetimes calibrating gear trains that measure time without a single circuit or battery.
        </p>
      </div>

      {/* Workshop Editorial Image Banner */}
      <div className="relative rounded-xl overflow-hidden border border-white/[0.1] shadow-2xl">
        <img
          src="/src/assets/images/craftsmanship_watchmaker_1791612587562.jpg"
          alt="Master horologist regulating mechanical escapement in Le Brassus atelier"
          className="w-full h-[400px] object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono text-[#C5A059] uppercase tracking-widest">
              Atelier Le Brassus · Canton of Vaud
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
              Hand-Regulation to -1/+2 Seconds per Day
            </h3>
          </div>
          <div className="text-xs font-mono text-slate-300 bg-black/60 backdrop-blur-md px-4 py-2 rounded border border-white/[0.1]">
            COSC Precision Standard: Surpassed by 200%
          </div>
        </div>
      </div>

      {/* Interactive Calibre Explorer */}
      <div className="space-y-8">
        <div className="border-b border-white/[0.08] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-medium">
              Interactive Anatomy
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mt-1">
              Mechanical Movement Architecture
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Select an organ to inspect its micro-mechanical specifications
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Component Tabs Left */}
          <div className="lg:col-span-5 space-y-2">
            {COMPONENTS.map((comp) => {
              const isSelected = selectedComp.id === comp.id;
              return (
                <button
                  key={comp.id}
                  onClick={() => setSelectedComp(comp)}
                  className={`w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#181D29] border-[#C5A059] shadow-[0_2px_12px_rgba(197,160,89,0.15)]'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12]'
                  }`}
                >
                  <div>
                    <h4
                      className={`text-sm font-semibold tracking-wide ${
                        isSelected ? 'text-[#C5A059]' : 'text-white'
                      }`}
                    >
                      {comp.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{comp.subtitle}</p>
                  </div>
                  <span
                    className={`text-xs font-mono ${
                      isSelected ? 'text-[#C5A059]' : 'text-slate-400'
                    }`}
                  >
                    →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Component Detail Right */}
          <div className="lg:col-span-7 bg-[#12151D] border border-white/[0.08] rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest">
                  {selectedComp.origin}
                </span>
                <h3 className="font-cinzel text-2xl font-bold text-white mt-1">
                  {selectedComp.name}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <Compass className="w-5 h-5" />
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {selectedComp.description}
            </p>

            <div className="p-4 rounded-lg bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                Atelier Specification
              </span>
              <p className="text-xs font-mono text-[#C5A059]">{selectedComp.specs}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Escapement Ticking Frequency Acoustic Lab */}
      <div className="p-8 sm:p-12 rounded-xl bg-gradient-to-b from-[#121622] to-[#0D1017] border border-white/[0.08] space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-medium">
              Horological Acoustic Laboratory
            </span>
            <h3 className="font-cinzel text-2xl font-bold text-white mt-1">
              Escapement Oscillation & Beat Rate
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Listen to the acoustic heartbeat of mechanical calibres across different vibrations per hour (vph). The higher the frequency, the smoother the sweeping second hand.
            </p>
          </div>

          <button
            onClick={toggleSound}
            className={`px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all self-start md:self-auto ${
              isPlayingSound
                ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                : 'bg-[#C5A059] text-black hover:bg-[#D4B36E] shadow'
            }`}
          >
            {isPlayingSound ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Mute Acoustic Heartbeat</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Play Escapement Beat</span>
              </>
            )}
          </button>
        </div>

        {/* Frequency Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { vph: 18000, hz: '2.5 Hz', title: '18,000 VPH', desc: '5 beats/sec · Heritage pocket watch cadence' },
            { vph: 21600, hz: '3.0 Hz', title: '21,600 VPH', desc: '6 beats/sec · Traditional tourbillon rhythm' },
            { vph: 28800, hz: '4.0 Hz', title: '28,800 VPH', desc: '8 beats/sec · Modern chronometer standard' },
            { vph: 36000, hz: '5.0 Hz', title: '36,000 VPH', desc: '10 beats/sec · Ultra high-beat fluid sweep' },
          ].map((item) => {
            const isSelected = activeFrequency === item.vph;
            return (
              <button
                key={item.vph}
                onClick={() => setActiveFrequency(item.vph)}
                className={`p-4 rounded-lg text-left border transition-all ${
                  isSelected
                    ? 'bg-[#C5A059]/15 border-[#C5A059] text-white shadow-md'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex justify-between items-baseline">
                  <span className="font-cinzel text-sm font-bold text-white">{item.title}</span>
                  <span className="font-mono text-xs text-[#C5A059]">{item.hz}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">{item.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Live Second Hand Sweeping Simulation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-6 border-t border-white/[0.06]">
          <div className="relative w-28 h-28 rounded-full border-2 border-[#C5A059]/40 bg-black/50 flex items-center justify-center shadow-inner">
            {/* Center pinion */}
            <div className="w-3 h-3 rounded-full bg-[#C5A059] z-20" />
            {/* Hour markers */}
            <div className="absolute top-1 text-[8px] font-mono text-slate-400">12</div>
            <div className="absolute bottom-1 text-[8px] font-mono text-slate-400">6</div>
            <div className="absolute left-1.5 text-[8px] font-mono text-slate-400">9</div>
            <div className="absolute right-1.5 text-[8px] font-mono text-slate-400">3</div>
            {/* Sweeping second hand */}
            <div
              className="absolute w-[1.5px] h-11 bg-[#C5A059] origin-bottom -translate-y-5 rounded-full"
              style={{
                animation: `spin ${60 / (activeFrequency / 3600)}s linear infinite`,
              }}
            />
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="text-xs uppercase tracking-wider text-slate-400">Simulated Sweeping Cadence</div>
            <div className="font-mono text-lg font-semibold text-white">
              {activeFrequency.toLocaleString()} Vibrations / Hour ({(activeFrequency / 3600).toFixed(1)} ticks per second)
            </div>
            <p className="text-xs text-slate-400">
              {isPlayingSound ? 'Acoustic audio ticks active.' : 'Click "Play Escapement Beat" above to hear audio synthesis.'}
            </p>
          </div>
        </div>
      </div>

      {/* The 5-Point Quality Accreditations */}
      <div className="space-y-6">
        <h3 className="font-cinzel text-xl font-bold text-white tracking-wide text-center">
          Manufacture Rigor & Certifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg bg-[#11141B] border border-white/[0.06] space-y-2">
            <Award className="w-6 h-6 text-[#C5A059]" />
            <h4 className="text-sm font-semibold text-white font-cinzel">Poinçon de Genève</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Guarantees the historical origin, finishing perfection, and chronometric regularity of Genevan watchmaking.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-[#11141B] border border-white/[0.06] space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
            <h4 className="text-sm font-semibold text-white font-cinzel">COSC Master Chronometer</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tested over 15 consecutive days in multiple orientations and temperature extremes with strict deviation tolerances.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-[#11141B] border border-white/[0.06] space-y-2">
            <Zap className="w-6 h-6 text-[#C5A059]" />
            <h4 className="text-sm font-semibold text-white font-cinzel">15,000 Gauss Anti-Magnetic</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Silicon escapement components impervious to modern magnetic fields from laptops and smartphones.
            </p>
          </div>
        </div>
      </div>

      {/* Cross-Page Discovery CTA */}
      {onNavigate && (
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-[#0C101A] via-[#090D14] to-black border border-gold/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-mono">
              Haute Horlogerie in Motion
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
              Experience Hand-Finished Calibres in Our Catalog
            </h3>
            <p className="text-xs text-slate-300 max-w-xl font-light">
              Explore timepieces housing these manufacture movements or commission a one-of-a-kind bespoke creation in our digital atelier.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('collections')}
              className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#C5A059] via-[#E2C775] to-[#B89243] hover:from-[#D4B36E] hover:to-[#C5A059] transition-all active:scale-95 shadow-[0_0_15px_rgba(197,160,89,0.3)] flex items-center gap-1.5"
            >
              <span>Explore Timepieces</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>
            <button
              onClick={() => onNavigate('bespoke')}
              className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-white/5 hover:bg-white/10 border border-gold/30 hover:border-gold transition-all"
            >
              <span>Bespoke Studio</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
