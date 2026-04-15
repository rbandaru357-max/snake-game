import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Github, Music, Gamepad2 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 backdrop-blur-md bg-black/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Gamepad2 className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500">
              NEON RHYTHM
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-cyan-400 transition-colors">ARCADE</a>
            <a href="#" className="hover:text-pink-400 transition-colors">PLAYLISTS</a>
            <a href="#" className="hover:text-white transition-colors">COMMUNITY</a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </button>
            <button className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-colors">
              SIGN IN
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Info & Stats */}
        <div className="lg:col-span-3 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-3xl bg-white/5 border border-white/10"
          >
            <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-[0.3em] mb-4">Current Session</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-gray-500 text-sm">Time Played</span>
                <span className="text-xl font-mono">12:45</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-gray-500 text-sm">Apples Eaten</span>
                <span className="text-xl font-mono">142</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-gray-500 text-sm">Rank</span>
                <span className="text-xl font-mono text-yellow-400">#04</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-3xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Music className="w-4 h-4 text-pink-400" />
              <h2 className="text-xs font-mono text-pink-400 uppercase tracking-[0.3em]">Up Next</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden">
                  <img src="https://picsum.photos/seed/track2/100/100" alt="Next" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="text-sm font-bold group-hover:text-pink-400 transition-colors">Cyber Pulse</p>
                  <p className="text-xs text-gray-500">Digital Dreamer</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden">
                  <img src="https://picsum.photos/seed/track3/100/100" alt="Next" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="text-sm font-bold group-hover:text-pink-400 transition-colors">Retro Future</p>
                  <p className="text-xs text-gray-500">Glitch Master</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Center Column: Game */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SnakeGame />
          </motion.div>
        </div>

        {/* Right Column: Music Player */}
        <div className="lg:col-span-3 flex flex-col items-center lg:items-end">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full"
          >
            <MusicPlayer />
          </motion.div>

          <div className="mt-8 w-full p-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-pink-500/10 border border-white/5">
            <h3 className="text-sm font-bold mb-2">Pro Tip</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              The snake moves faster as the beat drops. Keep your rhythm and don't hit the walls!
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">© 2024 Neon Rhythm Arcade. Built with AI & Passion.</p>
          <div className="flex gap-8 text-gray-500 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
