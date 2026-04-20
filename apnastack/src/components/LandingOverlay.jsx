import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import teamData from '../config/team.json';

const SplitText = ({ text, delayOffset = 0, className = '' }) => {
  return (
    <span className={`inline-block ${className}`}>
      {text.split('').map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.3, delay: delayOffset + index * 0.02, type: 'spring', stiffness: 200 }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

const TeamCard = ({ member, idx }) => {
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };
  
  const iconVars = {
    hidden: { scale: 0, opacity: 0, y: 10 },
    show: { scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.02, skewX: -2, zIndex: 50, transition: { duration: 0.3 } }}
      className={`group relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 p-8 md:p-12 border-y md:border-y-0 md:border-x border-[#00ffe0]/20 bg-black/60 backdrop-blur-xl overflow-hidden shadow-[0_0_50px_rgba(0,255,224,0.02)] hover:shadow-[0_0_100px_rgba(255,0,255,0.15)] hover:border-[#ff00ff] transition-all duration-500 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Background Infinite Marquee */}
      <div className="absolute inset-0 z-0 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-700 pointer-events-none flex items-center mix-blend-screen">
         <motion.div 
           animate={{ x: [0, -1500] }}
           transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
           className="whitespace-nowrap text-[12rem] font-black text-[#00ffe0] font-['JetBrains_Mono'] leading-none select-none tracking-tighter"
         >
            {member.role.repeat(15)}
         </motion.div>
      </div>
      
      {/* Scanline CRT Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==')] z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className={`relative z-30 flex flex-col ${idx % 2 === 1 ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} w-full flex-1`}>
         <motion.h3 className="text-5xl md:text-7xl font-black text-white mb-2 font-['Syne'] uppercase tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
           {member.name}
         </motion.h3>
         <h4 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00ffe0] to-[#ff00ff] font-['JetBrains_Mono'] tracking-widest mb-6 border-b border-white/10 pb-4 inline-block">
           {member.role}
         </h4>
         <p className="text-gray-400 font-['Syne'] text-xl md:text-2xl max-w-xl mb-8 leading-relaxed font-medium">
           {member.description}
         </p>
         
         <motion.div 
           variants={containerVars}
           initial="hidden"
           whileInView="show"
           viewport={{ once: true }}
           className="flex space-x-6"
         >
           <motion.a variants={iconVars} href={member.linkedin} target="_blank" rel="noreferrer" className="w-14 h-14 flex items-center justify-center bg-white/5 border border-white/10 hover:border-[#00ffe0] hover:bg-[#00ffe0]/10 text-white hover:text-[#00ffe0] transition-colors group/icon">
             <svg className="w-6 h-6 group-hover/icon:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
           </motion.a>
           <motion.a variants={iconVars} href={`mailto:${member.email}`} className="w-14 h-14 flex items-center justify-center bg-white/5 border border-white/10 hover:border-[#ff00ff] hover:bg-[#ff00ff]/10 text-white hover:text-[#ff00ff] transition-colors group/icon">
             <svg className="w-7 h-7 group-hover/icon:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
           </motion.a>
         </motion.div>
      </div>
      
      {/* Glitched Avatar Module */}
      <div className="relative z-30 shrink-0 w-64 h-64 md:w-80 md:h-80 border border-white/10 group-hover:border-[#ff00ff]/50 overflow-hidden transform group-hover:skew-x-2 group-hover:scale-105 transition-all duration-500 shadow-2xl bg-black">
         <div className="absolute inset-0 bg-[#00ffe0] mix-blend-color z-10 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
         <motion.img 
            initial={{ scale: 1.2, filter: 'grayscale(100%) contrast(1.2)' }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.1, filter: 'grayscale(0%) contrast(1.0)' }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            src={member.avatar}
            alt={member.name}
            className="w-full h-full object-cover"
         />
         <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
      </div>
    </motion.div>
  );
}

const WarpLines = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-[99]">
      {Array.from({ length: 80 }).map((_, i) => {
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const duration = 0.1 + Math.random() * 0.2;
        const delay = Math.random() * 0.2;
        return (
          <motion.div
            key={i}
            initial={{ scaleY: 0, opacity: 0, y: '-100%' }}
            animate={{ scaleY: [0, 4, 0], opacity: [0, 1, 0], y: ['-100%', '200%'] }}
            transition={{ 
              duration, 
              repeat: Infinity, 
              delay,
              ease: "linear"
            }}
            className="absolute bg-white/60 blur-[1px]"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: '1px',
              height: '100px',
            }}
          />
        );
      })}
    </div>
  );
};

export default function LandingOverlay() {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const teamSectionRef = useRef(null);
  const [warpState, setWarpState] = useState('idle'); // idle, charging, warping

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;
    
    const lenis = new Lenis({
        wrapper: wrapperRef.current,
        content: contentRef.current,
        lerp: 0.1,
        smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    window.localLenis = lenis;

    return () => {
      lenis.destroy();
      delete window.localLenis;
    };
  }, []);

  const handleWarpDrive = () => {
    if (window.localLenis && teamSectionRef.current) {
      setWarpState('charging');
      
      // Charging phase (200ms) - then FIRE
      setTimeout(() => {
        setWarpState('warping');
        
        window.localLenis.scrollTo(teamSectionRef.current, {
            duration: 1.5,
            // Violent quintic easing for a massive velocity peak
            easing: (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2
        });

        // After warping finish
        setTimeout(() => setWarpState('idle'), 1600);
      }, 200);
    }
  };

  return (
    <div 
      ref={wrapperRef}
      className={`absolute inset-0 overflow-y-auto overflow-x-hidden pointer-events-auto transition-all duration-300 ${warpState === 'warping' ? 'blur-md brightness-150 scale-[1.02]' : 'blur-0 brightness-100 scale-100'}`}
      style={{ zIndex: 50 }}
    >
      <div ref={contentRef}>
          {/* CRITICAL FX OVERLAY */}
          <AnimatePresence>
            {warpState !== 'idle' && (
                <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden"
                >
                    {/* Blinding White Flash */}
                    {warpState === 'charging' && (
                        <motion.div 
                           initial={{ scale: 0, opacity: 0 }}
                           animate={{ scale: 50, opacity: 1 }}
                           className="absolute w-10 h-10 bg-white rounded-full blur-2xl"
                        />
                    )}
                    
                    {/* The Tunnel FX */}
                    {warpState === 'warping' && (
                       <>
                         <div className="absolute inset-0 bg-white/20 backdrop-blur-sm shadow-[inset_0_0_100px_rgba(255,255,255,0.5)]" />
                         <WarpLines />
                       </>
                    )}
                </motion.div>
            )}
          </AnimatePresence>

          {/* Hero Page */}
          <div className="h-screen flex flex-col justify-center items-center pb-24 relative px-6">
            <h1 className="text-[10vw] md:text-[8vw] font-['Syne'] font-black text-white drop-shadow-[0_0_40px_rgba(0,255,224,0.5)] tracking-widest mt-[-15vh]">
              ALGOREEF
            </h1>
            
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="max-w-3xl text-center space-y-4 mt-6 z-10"
            >
                <p className="font-['JetBrains_Mono'] text-white md:text-xl text-md tracking-tight font-bold italic">
                   "Algorithms aren't just logic—they are the language of the universe. AlgoReef is where you finally see them."
                </p>
                <div className="w-32 h-1 bg-[#00ffe0] mx-auto mt-6 blur-sm animate-pulse" />
            </motion.div>
          </div>

          {/* New Mission Section */}
          <div className="min-h-screen flex flex-col justify-center items-center bg-black/40 backdrop-blur-md px-6 relative z-10 py-32 border-y border-white/5">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="max-w-4xl text-center space-y-12"
            >
                <h2 className="text-4xl md:text-6xl font-['Syne'] font-bold text-[#00ffe0] tracking-tight">
                  From Fear to <span className="text-white">Fascination.</span>
                </h2>
                <p className="text-gray-300 font-['Syne'] text-xl md:text-3xl leading-relaxed font-medium">
                   Data Structures and Algorithms often feel like an insurmountable wall of cold, intimidating code. We're here to tear that down. At AlgoReef, we transform abstract complexity into a living, breathing, interactive experience.
                </p>
                
                <div className="pt-12">
                   <button 
                     onClick={handleWarpDrive}
                     className="group inline-flex items-center justify-center px-12 py-6 font-bold text-[#00ffe0] bg-transparent border-2 border-[#00ffe0] rounded-full hover:bg-[#00ffe0] hover:text-black transition-all duration-500 shadow-[0_0_30px_rgba(0,255,224,0.3)] uppercase tracking-[0.4em] overflow-hidden"
                   >
                     <span className="relative z-10 font-['Syne'] text-lg">Ignite Warp Drive</span>
                     <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                   </button>
                </div>
            </motion.div>
          </div>

          {/* THE VOID SPACER - Forces the user to travel a massive distance */}
          <div className="h-[200vh] bg-black flex items-center justify-center">
             <div className="text-white font-['JetBrains_Mono'] opacity-5 uppercase tracking-[2em] text-4xl pointer-events-none">
                Traversing Hyperspace
             </div>
          </div>

          {/* Team Section */}
          <div 
            ref={teamSectionRef}
            className="min-h-screen bg-black border-t-2 border-[#00ffe0]/30 p-8 md:p-32 relative"
          >
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="mb-32 text-center pt-10">
                <h2 className="text-6xl md:text-8xl font-['Syne'] font-black text-white tracking-widest uppercase">
                  The <span className="text-[#00ffe0]">Architects</span>
                </h2>
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
