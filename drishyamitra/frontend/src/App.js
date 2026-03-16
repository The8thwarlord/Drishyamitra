import React, { useState } from "react";
import Gallery from "./components/Gallery";
import UploadSection from "./components/UploadSection";
import ChatAssistant from "./components/ChatAssistant";
import { Camera, Image as ImageIcon, UploadCloud, Sparkles } from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("gallery");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black text-gray-100 font-sans p-4 gap-6">
      
      {/* Floating Sidebar Navigation */}
      <nav className="w-72 flex flex-col glass-panel z-10 shrink-0 h-full overflow-hidden border-white/5 bg-white/[0.02]">
        <div className="p-8 mb-6 flex flex-col items-center gap-4 border-b border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent pointer-events-none" />
          <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-4 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.5)] transform hover:rotate-12 transition-transform duration-500">
             <Camera className="w-8 h-8 text-white" />
          </div>
          <div className="text-center relative z-10">
            <h1 className="text-2xl font-black text-gradient tracking-tight">
              Drishyamitra
            </h1>
            <p className="text-[0.7rem] text-violet-300/80 font-mono tracking-[0.2em] uppercase mt-1 flex items-center justify-center gap-1">
               <Sparkles className="w-3 h-3" /> AI Vision
            </p>
          </div>
        </div>
        
        <div className="flex-1 px-4 space-y-3">
          <button 
            onClick={() => setActiveTab("gallery")}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group ${
              activeTab === "gallery" 
                ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/10 text-white border border-violet-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_0_20px_rgba(139,92,246,0.15)] font-semibold" 
                : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
            }`}
          >
            <div className={`p-2 rounded-lg transition-colors ${activeTab === 'gallery' ? 'bg-violet-500/20 text-violet-300' : 'bg-white/5 group-hover:bg-white/10 text-gray-500 group-hover:text-gray-300'}`}>
               <ImageIcon className="w-5 h-5" />
            </div>
            Photo Gallery
          </button>
          
          <button 
            onClick={() => setActiveTab("upload")}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group ${
              activeTab === "upload" 
                ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/10 text-white border border-violet-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_0_20px_rgba(139,92,246,0.15)] font-semibold" 
                : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
            }`}
          >
            <div className={`p-2 rounded-lg transition-colors ${activeTab === 'upload' ? 'bg-violet-500/20 text-violet-300' : 'bg-white/5 group-hover:bg-white/10 text-gray-500 group-hover:text-gray-300'}`}>
               <UploadCloud className="w-5 h-5" />
            </div>
            Upload Dataset
          </button>
        </div>
        
        <div className="p-5 m-5 rounded-2xl bg-gradient-to-tr from-violet-900/30 to-fuchsia-900/10 border border-violet-500/20 backdrop-blur-xl relative overflow-hidden group hover:border-violet-500/40 transition-colors">
           <div className="absolute -right-4 -top-4 w-20 h-20 bg-violet-500/20 blur-2xl rounded-full group-hover:bg-violet-500/30 transition-colors" />
           <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mb-4 border border-violet-500/30">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,1)] animate-pulse" />
           </div>
           <p className="text-sm text-white font-medium">System Online</p>
           <p className="text-[11px] text-violet-300/60 mt-1 uppercase tracking-wider">Ready for requests</p>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden glass-panel h-full border-white/5 bg-black/40">
        {activeTab === "gallery" ? <Gallery key={refreshKey} /> : <UploadSection onUploadSuccess={handleUploadSuccess} />}
      </main>

      {/* Chat Assistant Section */}
      <aside className="w-[450px] shrink-0 flex flex-col h-full z-20">
        <ChatAssistant />
      </aside>
    </div>
  );
}

export default App;