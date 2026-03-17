import React, { useState, useEffect } from 'react';
import { getGallery, labelFace, deletePhoto } from '../services/api';
import { Image as ImageIcon, Loader2, Maximize2, X, Tag, UserPlus, ImageOff, Trash2 } from 'lucide-react';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [labelInput, setLabelInput] = useState('');
  const [selectedFaceId, setSelectedFaceId] = useState(null);
  const [labeling, setLabeling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await getGallery();
      setPhotos(data);
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
      setError('Failed to load gallery from server.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (photo) => {
    setSelectedPhoto(photo);
    setSelectedFaceId(null);
    setLabelInput('');
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    setSelectedFaceId(null);
    setLabelInput('');
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    setDeleting(true);
    try {
      await deletePhoto(photoId);
      // Removed from photos list locally
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      if (selectedPhoto && selectedPhoto.id === photoId) {
        closeModal();
      }
    } catch (err) {
      console.error("Failed to delete photo:", err);
      alert("Failed to delete photo. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleLabelFace = async () => {
    if (!selectedFaceId || !labelInput.trim()) return;
    
    setLabeling(true);
    try {
      await labelFace(selectedFaceId, labelInput.trim());
      // Refresh local state to show label
      setSelectedPhoto(prev => ({
        ...prev,
        faces: prev.faces.map(f => f.id === selectedFaceId ? { ...f, label: labelInput.trim() } : f)
      }));
      setLabelInput('');
      setSelectedFaceId(null);
    } catch (err) {
      console.error('Failed to label face:', err);
      alert('Failed to save label. Make sure the backend is reachable.');
    } finally {
      setLabeling(false);
      fetchGallery(); // Refresh gallery behind
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-violet-400">
        <Loader2 className="w-16 h-16 animate-spin mb-4" />
        <p className="text-xl font-medium tracking-wide">Loading Neural Gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="glass-panel p-8 max-w-md text-center border-red-500/30 bg-red-500/10">
           <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
           </div>
           <p className="text-red-400 text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 h-full overflow-y-auto relative">
      <div className="absolute top-0 right-[20%] w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="mb-10 flex items-end justify-between relative z-10">
        <div>
          <h2 className="text-4xl font-black flex items-center gap-4 text-white">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 shadow-lg">
               <ImageIcon className="w-8 h-8 text-fuchsia-400" />
            </div>
            Visual <span className="text-gradient">Index</span>
          </h2>
          <p className="text-gray-400 mt-3 text-lg font-medium">
            Browse processed imagery and identify unrecognized faces.
          </p>
        </div>
        <div className="bg-white/5 px-6 py-3 rounded-xl border border-white/10 backdrop-blur-md flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,1)]" />
           <span className="font-semibold text-white">{photos.length}</span> 
           <span className="text-gray-400 font-medium tracking-wide">Assets Loaded</span>
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 glass-panel border-dashed border-2 border-white/10">
          <ImageOff className="w-20 h-20 text-white/20 mb-6" />
          <p className="text-2xl font-bold text-gray-300">No assets detected</p>
          <p className="text-gray-500 mt-2 font-medium">Navigate to the upload module to begin populating the visual index.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
          {photos.map(photo => (
            <div 
              key={photo.id} 
              className="group relative aspect-square rounded-2xl overflow-hidden glass-panel cursor-pointer hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-500 hover:-translate-y-1"
              onClick={() => openModal(photo)}
            >
              <img 
                src={`/api/photos/download/${photo.id}`} 
                alt={photo.filename} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <p className="text-white font-medium truncate text-lg">{photo.filename}</p>
                <div className="flex items-center gap-2 mt-2">
                   <div className="bg-violet-500/20 px-2 py-1 rounded text-xs text-violet-300 font-medium border border-violet-500/30 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {photo.faces?.length || 0} faces
                   </div>
                </div>
                
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl backdrop-blur-md transition-colors border border-white/10 group-hover:scale-100 scale-90 opacity-0 group-hover:opacity-100 shadow-md">
                    <Maximize2 className="w-5 h-5 text-white" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePhoto(photo.id);
                    }}
                    className="bg-red-500/20 hover:bg-red-500/40 p-2.5 rounded-xl backdrop-blur-md transition-colors border border-red-500/30 group-hover:scale-100 scale-90 opacity-0 group-hover:opacity-100 shadow-md"
                  >
                    <Trash2 className="w-5 h-5 text-red-200" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={closeModal} />
          <div className="relative glass-panel w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-300 border-white/20 shadow-[0_0_50px_rgba(139,92,246,0.15)] bg-[#0c0c0e]">
            
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-white/10 p-2.5 rounded-full text-gray-300 hover:text-white transition-all border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => handleDeletePhoto(selectedPhoto.id)}
              disabled={deleting}
              className="absolute top-4 right-16 z-10 bg-red-900/50 hover:bg-red-500/80 p-2.5 rounded-full text-red-200 hover:text-white transition-all border border-red-500/30 disabled:opacity-50"
              title="Delete Photo"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            {/* Image display side */}
            <div className="w-full md:w-2/3 bg-black flex items-center justify-center relative group p-4 border-r border-white/5">
              <img 
                src={`/api/photos/download/${selectedPhoto.id}`} 
                alt={selectedPhoto.filename} 
                className="max-w-full max-h-[60vh] md:max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Intelligence Sidebar */}
            <div className="w-full md:w-1/3 flex flex-col bg-white/[0.02] relative overflow-y-auto">
              <div className="p-6 border-b border-white/5 bg-gradient-to-br from-violet-900/20 to-transparent">
                <h3 className="text-2xl font-black text-white text-gradient">Analysis</h3>
                <p className="text-sm text-gray-400 mt-1 truncate">{selectedPhoto.filename}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-mono text-gray-500">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Processed Asset
                </div>
              </div>

              <div className="p-6 flex-1">
                <h4 className="text-sm font-bold tracking-wider uppercase text-gray-400 flex items-center gap-2 mb-4">
                   <Tag className="w-4 h-4" /> Detected Entities
                </h4>
                
                {selectedPhoto.faces?.length > 0 ? (
                  <div className="space-y-3">
                    {selectedPhoto.faces.map((face, index) => (
                      <div 
                        key={face.id} 
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          selectedFaceId === face.id 
                            ? 'bg-violet-600/20 border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]' 
                            : 'bg-white/5 border-white/10 hover:border-violet-500/30 hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedFaceId(selectedFaceId === face.id ? null : face.id)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-white">Subject {index + 1}</span>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${face.label ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]'}`}>
                            {face.label || 'Unknown'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2 font-mono bg-black/30 p-2 rounded-lg border border-white/5">
                          Conf: {(face.confidence * 100).toFixed(1)}% | Pos: [{Math.round(face.box_x)}, {Math.round(face.box_y)}]
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed border-white/10 rounded-xl bg-white/5 text-gray-400">
                    No distinct subjects detected.
                  </div>
                )}
              </div>

              {selectedFaceId && (
                <div className="p-6 border-t border-white/5 bg-black/40 animate-in slide-in-from-bottom-5">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                     <UserPlus className="w-4 h-4 text-violet-400" /> Identity Assignment
                  </h4>
                  <div className="flex gap-2 relative group">
                    <input 
                      type="text"
                      className="flex-1 glass-input py-2.5 px-4 rounded-xl text-sm pr-20"
                      placeholder="e.g. John Doe"
                      value={labelInput}
                      onChange={e => setLabelInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleLabelFace()}
                    />
                    <button 
                      onClick={handleLabelFace}
                      disabled={!labelInput.trim() || labeling}
                      className="btn-primary py-2 px-4 shadow-none absolute right-1 top-1 bottom-1 text-sm font-medium"
                    >
                      {labeling ? <Loader2 className="w-4 h-4 text-white animate-spin mx-auto" /> : 'Save'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
