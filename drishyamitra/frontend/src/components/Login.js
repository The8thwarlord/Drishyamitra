import React, { useState } from 'react';
import { Camera, Sparkles, LogIn, Loader2 } from 'lucide-react';
import { login } from '../services/api';

const Login = ({ onLoginSuccess, onNavigateToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.access_token);
      onLoginSuccess();
    } catch (err) {
       setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black text-gray-100 font-sans p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md p-8 glass-panel border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.15)] relative z-10 flex flex-col items-center">
        
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-4 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.5)] transform hover:rotate-12 transition-transform duration-500">
             <Camera className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black text-gradient tracking-tight">
              Drishyamitra
            </h1>
            <p className="text-[0.7rem] text-violet-300/80 font-mono tracking-[0.2em] uppercase mt-1 flex items-center justify-center gap-1">
               <Sparkles className="w-3 h-3" /> System Access
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
           {error && (
             <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
               {error}
             </div>
           )}

           <div>
             <label className="block text-xs font-bold tracking-wider uppercase text-gray-400 mb-2">Email Identity</label>
             <input 
               type="email" 
               required
               value={email}
               onChange={e => setEmail(e.target.value)}
               className="w-full glass-input py-3 px-4 rounded-xl text-sm transition-all focus:bg-white/10"
               placeholder="operative@drishyamitra.net"
             />
           </div>

           <div>
             <label className="block text-xs font-bold tracking-wider uppercase text-gray-400 mb-2">Passphrase</label>
             <input 
               type="password" 
               required
               value={password}
               onChange={e => setPassword(e.target.value)}
               className="w-full glass-input py-3 px-4 rounded-xl text-sm transition-all focus:bg-white/10"
               placeholder="••••••••"
             />
           </div>

           <button 
             type="submit" 
             disabled={loading}
             className="w-full btn-primary py-3.5 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] flex justify-center items-center gap-2 mt-4"
           >
             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
             {loading ? 'Authenticating...' : 'Initialize Session'}
           </button>
        </form>

        <div className="mt-6 text-center">
           <p className="text-sm text-gray-500">
             Unregistered operative?{' '}
             <button onClick={onNavigateToSignUp} className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
               Request Clearance
             </button>
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
