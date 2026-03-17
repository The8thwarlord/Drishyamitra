import React, { useState } from 'react';
import { Camera, Sparkles, UserPlus, Loader2 } from 'lucide-react';
import { register } from '../services/api';

const SignUp = ({ onSignUpSuccess, onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, password);
      onSignUpSuccess(); // E.g., switch back to login screen with a success message
    } catch (err) {
       setError(err.response?.data?.error || 'Registration failed.');
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black text-gray-100 font-sans p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md p-8 glass-panel border-white/10 shadow-[0_0_50px_rgba(217,70,239,0.1)] relative z-10 flex flex-col items-center animate-in zoom-in-95 duration-500">
        
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="bg-gradient-to-br from-fuchsia-600 to-violet-600 p-4 rounded-2xl shadow-[0_0_30px_rgba(217,70,239,0.4)] transform hover:rotate-12 transition-transform duration-500">
             <UserPlus className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
             <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-400 tracking-tight">
               Clearance Request
            </h1>
            <p className="text-[0.7rem] text-fuchsia-300/80 font-mono tracking-[0.2em] uppercase mt-1 flex items-center justify-center gap-1">
               <Sparkles className="w-3 h-3" /> Drishyamitra Core
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
             <label className="block text-xs font-bold tracking-wider uppercase text-gray-400 mb-2">New Email Identity</label>
             <input 
               type="email" 
               required
               value={email}
               onChange={e => setEmail(e.target.value)}
               className="w-full glass-input py-3 px-4 rounded-xl text-sm transition-all focus:bg-white/10"
               placeholder="agent@drishyamitra.net"
             />
           </div>

           <div>
             <label className="block text-xs font-bold tracking-wider uppercase text-gray-400 mb-2">Secure Passphrase</label>
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
             className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white font-semibold py-3.5 rounded-xl shadow-[0_0_20px_rgba(217,70,239,0.3)] flex justify-center items-center gap-2 mt-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
           >
             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
             {loading ? 'Processing...' : 'Register Identity'}
           </button>
        </form>

        <div className="mt-6 text-center">
           <p className="text-sm text-gray-500">
             Clearance already granted?{' '}
             <button onClick={onNavigateToLogin} className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold transition-colors">
               Initialize Session
             </button>
           </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
