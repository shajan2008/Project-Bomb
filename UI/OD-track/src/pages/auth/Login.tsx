import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import type { Role } from '../../context/AuthContext';
import {
  GraduationCap,
  Presentation,
  Landmark,
  Zap,
  Lock,
  BarChart3,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

// Dean role removed (Phase 3) — only the three remaining roles are selectable.
const roles: { id: Role; label: string; icon: LucideIcon }[] = [
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'mentor', label: 'Mentor', icon: Presentation },
  { id: 'hod', label: 'HOD', icon: Landmark },
];

const features: { icon: LucideIcon; text: string }[] = [
  { icon: Zap, text: 'Instant status updates' },
  { icon: Lock, text: 'Role-based access control' },
  { icon: BarChart3, text: 'Analytics & trend reports' },
];

const sampleUsers: Record<Role, { email: string; name: string }> = {
  student: { email: 'arjun.kumar@college.edu', name: 'Arjun Kumar' },
  mentor: { email: 'dr.priya@college.edu', name: 'Dr. Priya Sharma' },
  hod: { email: 'hod.cse@college.edu', name: 'Prof. Ramesh Iyer' },
};

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(selectedRole, sampleUsers[selectedRole].name);
      // Matches this project's existing route name (`/upload`), not the
      // `/verify` name used in the routes.tsx draft — kept consistent with
      // the real routes.ts below.
      navigate('/upload');
      setLoading(false);
    }, 800);
  };

  const autofill = () => {
    setEmail(sampleUsers[selectedRole].email);
    setPassword('••••••••');
  };

  return (
    <div className="page-bg min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div
        className="w-full max-w-5xl flex flex-col md:flex-row rounded-[28px] overflow-hidden shadow-2xl"
        style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(2px)' }}
      >
        {/* Left panel */}
        <div
          className="hidden md:flex flex-col justify-between md:w-[45%] p-8 lg:p-10 relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(168,200,236,0.4) 0%, rgba(168,230,201,0.35) 100%)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255,255,255,0.5)',
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl font-display shadow-lg shrink-0">
                OD
              </div>
              <div>
                <div className="font-display font-bold text-[22px] text-text">ODTrack</div>
                <div className="text-[12px] text-text-muted">On-Duty Request Management</div>
              </div>
            </div>
            <h2 className="font-display font-semibold text-[26px] lg:text-[28px] text-text leading-snug mb-3">
              Streamline your OD requests
            </h2>
            <p className="text-[14px] text-[#5A6170] leading-relaxed">
              One platform for students to submit, mentors to approve, and administrators to oversee all on-duty requests across the institution.
            </p>
          </div>
          <div className="space-y-3">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-3 glass-card px-4 py-3">
                <f.icon size={18} className="text-text shrink-0" />
                <span className="text-[13px] font-medium text-text">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div
          className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center"
          style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(24px)' }}
        >
          <div className="mb-6 sm:mb-7">
            <h3 className="font-display font-bold text-[22px] sm:text-[24px] text-text">Sign In</h3>
            <p className="text-[13px] text-text-muted mt-1">Select your role to continue</p>
          </div>

          {/* Role tabs */}
          <div
            className="grid grid-cols-3 gap-2 mb-6 sm:mb-7 p-1 rounded-[14px]"
            style={{ background: 'rgba(255,255,255,0.3)' }}
          >
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => { setSelectedRole(r.id); setEmail(''); setPassword(''); }}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-[10px] transition-all text-[12px] font-semibold ${
                  selectedRole === r.id
                    ? 'bg-white shadow-sm text-text'
                    : 'text-text-muted hover:bg-white/40'
                }`}
              >
                <r.icon size={18} />
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
                Email / ID
              </label>
              <input
                type="email"
                className="glass-input"
                placeholder={sampleUsers[selectedRole].email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="glass-input pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded"
                />
                <span className="text-[13px] text-text-muted">Remember me</span>
              </label>
              <button type="button" className="text-[13px] text-blue-500 hover:text-blue-700 font-medium">
                Forgot password?
              </button>
            </div>

            {/* CAPTCHA placeholder */}
            <div
              className="glass-card p-3 flex items-center gap-3 rounded-[12px]"
              style={{ background: 'rgba(255,255,255,0.4)' }}
            >
              <div className="w-5 h-5 rounded border-2 border-green-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={12} className="text-green-500" />
              </div>
              <span className="text-[13px] text-[#5A6170] flex-1">I'm not a robot</span>
              <ShieldCheck size={28} className="text-text-muted opacity-40 shrink-0" />
            </div>

            <button type="button" onClick={autofill} className="btn-secondary w-full text-[13px] flex items-center justify-center gap-1.5">
              <Sparkles size={14} />
              Auto-fill demo credentials
            </button>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in…' : `Sign in as ${roles.find((r) => r.id === selectedRole)?.label}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
