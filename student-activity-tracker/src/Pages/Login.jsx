
import React, { useState } from 'react';
import { Mail, KeyRound, Eye, EyeOff, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [roles] = useState(['Student', 'Faculty', 'Admin', 'Guest']);
  const [role, setRole] = useState('Student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log({ role, email, password, rememberMe });

    setTimeout(() => {
      setLoading(false);
    }, 1000);
    navigate("/dashboard.jsx");
  };
  
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white font-sans">
      {/* Left Panel */}
      <section className="relative hidden lg:flex flex-col justify-between p-12 lg:p-16 bg-gradient-to-b from-[#0b2575] via-[#091b54] to-[#040e2d] text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">OD TRACK</span>
        </div>

        <div className="relative z-10 my-auto py-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            OD Management System
          </h1>
          <p className="mt-4 text-sm sm:text-base text-blue-200/80 max-w-lg leading-relaxed">
            Automate college on-duty requests, approvals, and tracking with instant notifications and high-level role clearance flows.
          </p>
          <div className="relative mt-12 h-72 w-full max-w-md">
            <div className="absolute top-0 left-0 w-64 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex justify-center items-center w-8 h-8 rounded-full bg-blue-500">
                    S
                  </div>
                  <span className="text-xs font-medium text-white/90">Shajan</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Approved
                </span>
              </div>
              <div className="mt-3">
                <p className="text-xs font-semibold text-white">National Hackathon OD</p>
                <p className="text-[10px] text-blue-200/70 mt-0.5">3 Days • Academic</p>
              </div>
            </div>
            <div className="absolute top-14 right-0 w-64 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex justify-center items-center bg-indigo-500 rounded-full w-8 h-8">
                    D
                  </div>
                  <span className="text-xs font-medium text-white/90">DINESHRAM</span>
                </div>
                <div className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Pending
                </div>
              </div>
              <p className="text-xs font-semibold text-white mt-3">Inter College Hack-fest</p>
               <p className="text-[10px] text-blue-200/70 mt-0.5">5 Days • Academic</p>
            </div>
          </div>
        </div>
      </section>

      {/* Right Panel - Login Form */}
      <section className="flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-[420px] space-y-7">
          {/* Header */}
          <div>
            <h2 className="text-xl font-medium text-slate-500">Sign in to your account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select Role Segment */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Select Your Role</label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
                {(roles || []).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-150 ${
                      role === r
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Email / Student ID */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
               SRMIST NetID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="____@srmist.edu.in"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer h-4 w-4 appearance-none rounded border border-slate-300 bg-white checked:border-blue-600 checked:bg-blue-600 focus:outline-none"
                  />
                  <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none stroke-[3]" />
                </div>
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="font-medium text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 text-xs text-red-600 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-xs transition-colors disabled:opacity-70 cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Contact Administrator Footer */}
          <div className="pt-4 text-center">
            <div className="py-3 px-4 rounded-xl border border-slate-200/80 bg-slate-50/50 text-xs sm:text-sm text-slate-500">
              Don't have an account?{' '}
              <a href="#contact" className="font-medium text-blue-600 hover:underline">
                Contact your administrator
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}