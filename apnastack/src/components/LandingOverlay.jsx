import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import teamData from '../config/team.json';
import { useAppStore } from '../store/dsStore';

/* ─── Animated star-streak warp tunnel ─────────────────────────────────────── */
const WarpTunnel = ({ active }) => {
  const STREAK_COUNT = 120;

  // Generate streaks once — random positions, lengths, durations
  const streaks = useMemo(() => Array.from({ length: STREAK_COUNT }, (_, i) => {
    const angle  = (i / STREAK_COUNT) * Math.PI * 2;
    const radius = 8 + Math.random() * 42;   // vw from centre
    const cx = 50 + Math.cos(angle) * radius;
    const cy = 50 + Math.sin(angle) * radius;
    return {
      cx, cy,
      length:   40 + Math.random() * 120,    // px
      angle:    angle * (180 / Math.PI),
      dur:      0.06 + Math.random() * 0.12,
      delay:    Math.random() * 0.2,
      opacity:  0.5 + Math.random() * 0.5,
    };
  }), []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[101] overflow-hidden">
      {streaks.map((s, i) => (
        <motion.div
          key={i}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 1, 1, 0], opacity: [0, s.opacity, s.opacity, 0] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            left: `${s.cx}%`,
            top:  `${s.cy}%`,
            width: s.length,
            height: 1.5,
            background: 'linear-gradient(to right, transparent, var(--accent), transparent)',
            transform: `rotate(${s.angle}deg)`,
            transformOrigin: 'left center',
            borderRadius: 999,
          }}
        />
      ))}
    </div>
  );
};

/* ─── Radial shockwave ring ─────────────────────────────────────────────────── */
const ShockRing = ({ active }) => {
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[102] flex items-center justify-center">
      {[0, 0.1, 0.2].map((delay, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: '2px solid var(--accent)',
            boxShadow: '0 0 20px var(--accent)',
          }}
        />
      ))}
    </div>
  );
};

/* ─── Team card ─────────────────────────────────────────────────────────────── */
const TeamCard = ({ member, idx }) => {
  const containerVars = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };
  const iconVars = {
    hidden: { scale: 0, opacity: 0, y: 10 },
    show:   { scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.02, skewX: -2, zIndex: 50, transition: { duration: 0.3 } }}
      className={`group relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 p-8 md:p-12 overflow-hidden transition-all duration-500 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
      style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'color-mix(in srgb, var(--bg) 60%, transparent)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Marquee background */}
      <div className="absolute inset-0 z-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none flex items-center overflow-hidden">
        <motion.div
          animate={{ x: [0, -1500] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="whitespace-nowrap text-[12rem] font-black font-['JetBrains_Mono'] leading-none select-none tracking-tighter"
          style={{ color: 'var(--accent)' }}
        >
          {member.role.repeat(15)}
        </motion.div>
      </div>

      {/* Text content */}
      <div className={`relative z-30 flex flex-col ${idx % 2 === 1 ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} w-full flex-1`}>
        <motion.h3
          className="text-5xl md:text-7xl font-black mb-2 font-['Syne'] uppercase tracking-tight"
          style={{ color: 'var(--text)' }}
        >
          {member.name}
        </motion.h3>

        <h4
          className="text-xl md:text-2xl font-bold font-['JetBrains_Mono'] tracking-widest mb-6 pb-4 inline-block"
          style={{
            background: 'linear-gradient(to right, var(--accent), var(--accent2))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {member.role}
        </h4>

        <p
          className="font-['Syne'] text-xl md:text-2xl max-w-xl mb-8 leading-relaxed font-medium"
          style={{ color: 'var(--text-mid)' }}
        >
          {member.description}
        </p>

        <motion.div variants={containerVars} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex space-x-6">
          <motion.a
            variants={iconVars}
            href={member.linkedin}
            target="_blank"
            rel="noreferrer"
            className="w-14 h-14 flex items-center justify-center transition-colors group/icon"
            style={{ border: '1px solid var(--border)', background: 'var(--btn-bg)' }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </motion.a>
          <motion.a
            variants={iconVars}
            href={`mailto:${member.email}`}
            className="w-14 h-14 flex items-center justify-center transition-colors group/icon"
            style={{ border: '1px solid var(--border)', background: 'var(--btn-bg)' }}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent2)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ─── Main overlay ──────────────────────────────────────────────────────────── */
export default function LandingOverlay() {
  const wrapperRef     = useRef(null);
  const contentRef     = useRef(null);
  const teamSectionRef = useRef(null);
  const [warpState, setWarpState] = useState('idle'); // idle | charging | warping
  const theme = useAppStore(s => s.theme);

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;
    const lenis = new Lenis({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      lerp: 0.1,
      smoothWheel: true,
    });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    window.localLenis = lenis;
    return () => { lenis.destroy(); delete window.localLenis; };
  }, []);

  const handleWarpDrive = () => {
    if (!window.localLenis || !teamSectionRef.current) return;

    // Phase 1: charging flash (150 ms)
    setWarpState('charging');
    setTimeout(() => {
      // Phase 2: hyperspace streaks + scroll
      setWarpState('warping');
      window.localLenis.scrollTo(teamSectionRef.current, {
        duration: 1.2,
        easing: (t) => t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2,
      });
      // Phase 3: shockwave on arrival
      setTimeout(() => setWarpState('shock'), 1200);
      setTimeout(() => setWarpState('idle'), 2000);
    }, 200);
  };

  const isWarping   = warpState === 'warping';
  const isCharging  = warpState === 'charging';
  const isShock     = warpState === 'shock';

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 overflow-y-auto overflow-x-hidden pointer-events-auto"
      style={{
        zIndex: 50,
        filter:    isWarping ? 'blur(3px) brightness(1.4)' : 'none',
        transform: isWarping ? 'scaleY(0.97)' : 'none',
        transition: 'filter 0.15s, transform 0.15s',
        background: 'transparent',
      }}
    >
      <div ref={contentRef}>

        {/* ── Warp FX layers ───────────────────────────────────────── */}
        <AnimatePresence>
          {isCharging && (
            <motion.div
              key="charge"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none z-[103] flex items-center justify-center"
            >
              {/* Expanding energy disc */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 60, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{
                  width: 20, height: 20,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, var(--accent) 0%, var(--accent2) 60%, transparent 100%)',
                  position: 'absolute',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hyperspace tunnel streaks */}
        <WarpTunnel active={isWarping} />

        {/* Arrival shockwave rings */}
        <AnimatePresence>
          {isShock && <ShockRing key="shock" active />}
        </AnimatePresence>

        {/* Vignette during warp */}
        <AnimatePresence>
          {isWarping && (
            <motion.div
              key="vignette"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none z-[100]"
              style={{
                background: 'radial-gradient(ellipse 60% 60% at 50% 50%, transparent 0%, var(--bg) 100%)',
              }}
            />
          )}
        </AnimatePresence>

        {/* ── Hero section ──────────────────────────────────────────── */}
        <div className="h-screen flex flex-col justify-center items-center pb-24 relative px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="max-w-3xl text-center space-y-4 mt-[30vh] z-10"
          >
            <p
              className="font-['JetBrains_Mono'] md:text-xl text-md tracking-tight font-bold italic"
              style={{ color: 'var(--text-mid)' }}
            >
              "Algorithms aren't just logic — they are the language of the universe. AlgoReef is where you finally see them."
            </p>
            <motion.div
              animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="w-32 h-0.5 mx-auto mt-6"
              style={{ background: 'var(--accent)', boxShadow: '0 0 12px var(--accent)' }}
            />
          </motion.div>
        </div>

        {/* ── Mission section ───────────────────────────────────────── */}
        <div
          className="min-h-screen flex flex-col justify-center items-center backdrop-blur-md px-6 relative z-10 py-32"
          style={{
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            background: 'color-mix(in srgb, var(--bg) 40%, transparent)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl text-center space-y-12"
          >
            <h2
              className="text-4xl md:text-6xl font-['Syne'] font-bold tracking-tight"
              style={{ color: 'var(--accent)' }}
            >
              From Fear to{' '}
              <span style={{ color: 'var(--text)' }}>Fascination.</span>
            </h2>
            <p
              className="font-['Syne'] text-xl md:text-3xl leading-relaxed font-medium"
              style={{ color: 'var(--text-mid)' }}
            >
              Data Structures and Algorithms often feel like an insurmountable wall of cold, intimidating code.
              We're here to tear that down. At AlgoReef, we transform abstract complexity into a living, breathing, interactive experience.
            </p>

            <div className="pt-12">
              <motion.button
                onClick={handleWarpDrive}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative inline-flex items-center justify-center px-12 py-6 font-bold font-['Syne'] text-lg uppercase tracking-[0.4em] overflow-hidden rounded-full"
                style={{
                  border: '2px solid var(--accent)',
                  color: 'var(--accent)',
                  boxShadow: '0 0 30px color-mix(in srgb, var(--accent) 30%, transparent)',
                }}
              >
                <motion.span
                  className="absolute inset-0 rounded-full"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{ background: 'var(--accent)', originX: '50%', originY: '50%' }}
                />
                <span className="relative z-10" style={{ mixBlendMode: 'difference' }}>
                  Ignite Warp Drive
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* ── Void spacer ───────────────────────────────────────────── */}
        <div
          className="h-[200vh] flex items-center justify-center"
          style={{ background: 'var(--bg)' }}
        >
          <p
            className="font-['JetBrains_Mono'] opacity-[0.04] uppercase tracking-[2em] text-4xl pointer-events-none select-none"
            style={{ color: 'var(--text)' }}
          >
            Traversing Hyperspace
          </p>
        </div>

        {/* ── Team section ──────────────────────────────────────────── */}
        <div
          ref={teamSectionRef}
          className="min-h-screen p-8 md:p-32 relative"
          style={{ borderTop: '2px solid var(--border-strong)', background: 'var(--bg)' }}
        >
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="mb-32 text-center pt-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-6xl md:text-8xl font-['Syne'] font-black tracking-widest uppercase"
                style={{ color: 'var(--text)' }}
              >
                The{' '}
                <span style={{ color: 'var(--accent)' }}>Architects</span>
              </motion.h2>
            </div>

            <div className="space-y-40">
              {teamData.map((member, idx) => (
                <TeamCard key={`team-member-${idx}`} member={member} idx={idx} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
