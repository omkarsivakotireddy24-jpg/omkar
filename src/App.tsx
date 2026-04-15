import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Music2, Gamepad2, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Background Effects */}
      <div className="atmosphere" />
      <div className="scanline" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.5)]">
            <Zap className="text-black fill-current w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white leading-none neon-glow">NEON PULSE</h1>
            <p className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-[0.2em]">Snake & Beats v1.0</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-xs font-bold text-white/40 hover:text-cyan-400 transition-colors uppercase tracking-widest">Leaderboard</a>
          <a href="#" className="text-xs font-bold text-white/40 hover:text-cyan-400 transition-colors uppercase tracking-widest">Settings</a>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span className="text-[10px] font-mono text-white/60 uppercase">Server Online</span>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-center">
        {/* Game Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center"
        >
          <div className="relative">
            {/* Decorative corner accents */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50" />
            <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50" />
            <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50" />
            
            <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-2 mb-4 px-2">
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-bold text-cyan-400/60 uppercase tracking-widest">Game Module</span>
              </div>
              <SnakeGame />
            </div>
          </div>
        </motion.section>

        {/* Sidebar Section */}
        <motion.aside 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          {/* Music Player */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <Music2 className="w-4 h-4 text-magenta-500" />
              <span className="text-[10px] font-bold text-magenta-500/60 uppercase tracking-widest">Audio Processor</span>
            </div>
            <MusicPlayer />
          </div>

          {/* Quick Stats / Info */}
          <div className="bg-white/5 border border-white/5 rounded-3xl p-6 space-y-4">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">System Status</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-white/40 uppercase">Latency</span>
                <span className="text-[10px] font-mono text-cyan-400">12ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-white/40 uppercase">Audio Engine</span>
                <span className="text-[10px] font-mono text-cyan-400">Ready</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-white/40 uppercase">Visualizer</span>
                <span className="text-[10px] font-mono text-cyan-400">Active</span>
              </div>
            </div>
          </div>
        </motion.aside>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full p-6 flex justify-center items-center z-50 pointer-events-none">
        <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">
          Designed for the Neon Future • 2026
        </p>
      </footer>
    </div>
  );
}
