import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/dsStore';

const INTRO_DATA = {
  1: {
    title: "THE STACK",
    subtitle: "Last In, First Out (LIFO)",
    text: "Think of a physical pile of heavy plates. You can only safely add a new plate to the very top, and you must remove the top plate before accessing the ones underneath. Stacks govern how programs handle function calls and 'Undo' histories."
  },
  2: {
    title: "THE QUEUE",
    subtitle: "First In, First Out (FIFO)",
    text: "Exactly like waiting in line at a movie theater. The first person to join the queue is the first one served and removed. Queues are universal—powering web traffic, task scheduling, and message protocols."
  },
  3: {
    title: "LINKED LIST",
    subtitle: "Shattered Memory",
    text: "Unlike an array, a Linked List doesn't store data sequentially in memory. Instead, it scatters data across empty space. Each piece of data (a Node) contains a physical pointer holding the exact GPS coordinates of the next node in the chain."
  },
  4: {
    title: "BINARY TREE",
    subtitle: "Hierarchical Traversal",
    text: "Data organized like a root system. Every node can branch into two directions holding smaller data to the left and larger data to the right. This geometry drastically collapses search times from linear to logarithmic speeds."
  },
  5: {
    title: "THE GRAPH",
    subtitle: "Webs of Reality",
    text: "The ultimate data structure. Graphs map relational logic—representing city roads, social media friends, and the physical internet itself. Nodes connect to each other via Edges, forming complex networks."
  },
  6: {
    title: "DYNAMIC PROGRAMMING",
    subtitle: "Remembering the Past",
    text: "Why calculate what you already know? Dynamic Programming (Tabulation) breaks massive problems into smaller grids. By storing previously computed answers in a massive table, the algorithm simply 'looks up' history instead of repeating work."
  },
  7: {
    title: "BACKTRACKING",
    subtitle: "The N-Queens Paradigm",
    text: "The ultimate trial and error. Backtracking explores a path until it hits a rigid dead end, then physically undoes its last move and tries an alternative. We will visualize this using the classic N-Queens chess problem."
  },
  8: {
    title: "DIVIDE & CONQUER",
    subtitle: "Shatter to Solve",
    text: "Solving a 10,000-item problem is hard. Solving a 1-item problem is trivial. Divide & Conquer recursively splits a massive array in half until every piece is isolated, then mathematically stitches them back together in perfect order."
  },
  9: {
    title: "GREEDY ALGORITHMS",
    subtitle: "The Cashier's Dilemma",
    text: "Greedy logic doesn't look at the big picture. It only asks: 'What is the absolute best move I can make right exactly now?' We visualize this with the Coin Change problem—always grabbing the largest possible denomination to reach a target sum."
  },
  10: {
    title: "SORTING ALGORITHMS",
    subtitle: "Imposing Order on Chaos",
    text: "The foundational problem of Computer Science. Watch pure entropy physically organize itself as algorithms like Quick Sort and Bubble Sort manipulate unsorted arrays through physical swapping logic."
  },
  11: {
    title: "RECURSION",
    subtitle: "The Call Stack",
    text: "A function that constantly summons copies of itself. To understand Recursion, you must see the physical 'Memory Frames' stacking on top of each other. The tower grows until it hits the Base Case, collapsing back down with the final answer."
  }
};

export default function IntroOverlay() {
  const currentScene = useAppStore(s => s.currentScene);
  const hasSeenIntro = useAppStore(s => s.hasSeenIntro);
  const setSeenIntro = useAppStore(s => s.setSeenIntro);

  if (currentScene === 0) return null; // Handled by LandingOverlay

  const data = INTRO_DATA[currentScene];
  if (!data) return null;

  return (
    <AnimatePresence>
      {!hasSeenIntro && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(30px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)", scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col justify-center items-center bg-black/70 px-6"
        >
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-4xl text-center space-y-8"
          >
            <div className="space-y-2">
              <h1 className="text-6xl md:text-8xl font-black font-['Syne'] text-transparent bg-clip-text bg-white drop-shadow-[0_0_30px_rgba(0,255,224,0.3)] tracking-widest uppercase">
                {data.title}
              </h1>
              <h3 className="text-xl md:text-3xl text-[#00ffe0] font-['JetBrains_Mono'] tracking-wider uppercase opacity-90">
                {data.subtitle}
              </h3>
            </div>
            
            <p className="text-gray-300 font-['Syne'] text-lg md:text-2xl leading-relaxed max-w-3xl mx-auto opacity-90">
              {data.text}
            </p>
            
            <div className="pt-12">
              <button 
                onClick={() => setSeenIntro(true)}
                className="group inline-flex items-center justify-center px-10 py-4 font-bold text-black bg-[#00ffe0] border-2 border-[#00ffe0] rounded-full hover:bg-transparent hover:text-[#00ffe0] transition-all duration-300 shadow-[0_0_40px_rgba(0,255,224,0.4)] uppercase tracking-[0.2em] overflow-hidden"
              >
                <span className="relative z-10 font-['Syne'] text-lg">Start Exploring</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
