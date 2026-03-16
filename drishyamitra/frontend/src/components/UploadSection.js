import React, { useState, useRef } from 'react';
import { uploadPhoto } from '../services/api';
import { UploadCloud, FileImage, Loader2, CheckCircle2, CloudLightning } from 'lucide-react';

const UploadSection = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    const file = files[0];
    if (!file.type.match('image.*')) {
        setErrorMsg('Please upload an image file (JPEG, PNG).');
        return;
    }

    setUploading(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      await uploadPhoto(file);
      setSuccess(true);
      if (onUploadSuccess) onUploadSuccess();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      setErrorMsg(error.response?.data?.error || 'Failed to upload photo.');
    } finally {
      setUploading(false);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="p-10 h-full flex flex-col relative overflow-hidden overflow-y-auto">
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="mb-10 relative z-10">
        <h2 className="text-4xl font-black flex items-center gap-4 text-white">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 shadow-lg">
             <CloudLightning className="w-8 h-8 text-violet-400" />
          </div>
          Upload <span className="text-gradient">Dataset</span>
        </h2>
        <p className="text-gray-400 mt-3 text-lg font-medium max-w-2xl">
          Feed the engine. Upload pristine images to allow Drishyamitra's facial recognition neural networks to map and learn your subjects.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-h-[600px] relative z-10">
        <div 
          className={`w-full max-w-3xl glass-panel border-2 border-dashed p-16 flex flex-col items-center justify-center transition-all duration-300 ${
              dragActive 
                ? 'border-violet-500 bg-violet-500/10 scale-[1.02] shadow-[0_0_40px_rgba(139,92,246,0.2)]' 
                : 'border-white/20 hover:border-violet-500/50 hover:bg-white/5'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            ref={inputRef} 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleChange} 
            className="hidden" 
          />
          
          {uploading ? (
             <div className="flex flex-col items-center text-violet-400 animate-pulse">
                <Loader2 className="w-20 h-20 animate-spin mb-6" />
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Processing Neural Map...</p>
             </div>
          ) : success ? (
              <div className="flex flex-col items-center text-emerald-400 animate-in zoom-in duration-300">
                <CheckCircle2 className="w-24 h-24 mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Upload Complete</p>
             </div>
          ) : (
              <div className="flex flex-col items-center text-center animate-in fade-in duration-500">
                  <div className="bg-gradient-to-tr from-violet-600/20 to-indigo-600/20 p-6 rounded-full mb-8 text-violet-300 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] relative group">
                     <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                     <FileImage className="w-16 h-16 relative z-10 animate-float" />
                  </div>
                  <p className="text-2xl font-bold mb-3 text-white">Drag & Drop visual data</p>
                  <p className="text-gray-400 mb-8 font-medium">Supported formats: JPEG, PNG up to 10MB</p>
                  <button 
                    onClick={onButtonClick}
                    className="btn-primary text-lg px-8 py-4 flex items-center gap-3"
                  >
                    <UploadCloud className="w-6 h-6" />
                    Browse Files
                  </button>
                  {errorMsg && (
                    <div className="mt-8 bg-red-500/10 px-6 py-3 rounded-xl border border-red-500/20 flex items-center gap-3 text-red-400 font-medium">
                      <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                      {errorMsg}
                    </div>
                  )}
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
