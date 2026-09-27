import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Role = 'student' | 'mentor' | 'hod';

/**
 * Tracks the post-login document verification step.
 * - 'pending'   : not yet handled — students are route-locked out of their dashboard until this becomes 'submitted'.
 * - 'submitted' : user uploaded photo + ID document (students only reach this state).
 * - 'skipped'   : mentor/HOD explicitly clicked "Skip for now".
 */
export type DocumentStep = 'pending' | 'submitted' | 'skipped';

interface AuthState {
  role: Role | null;
  name: string;
  documentStep: DocumentStep;
}

interface AuthContextValue extends AuthState {
  login: (role: Role, name: string) => void;
  logout: () => void;
  completeDocumentUpload: () => void;
  skipDocumentUpload: () => void;
}

const STORAGE_KEY = 'odtrack.auth.v1';

const defaultState: AuthState = { role: null, name: '', documentStep: 'pending' };

/**
 * IMPORTANT: this reads storage synchronously in the useState initializer,
 * not inside a useEffect. Hydrating asynchronously (after first paint) was
 * the root cause of the "sidebar looks fine but ignores the first few
 * clicks" symptom: role is briefly null on the very first render, Sidebar
 * returns null for that render and mounts a fresh <aside> a tick later once
 * the effect fires. Any click that lands during that gap targets a DOM node
 * that gets thrown away, so the click event never reaches the new NavLink.
 * Reading synchronously means the correct sidebar is in the DOM on the very
 * first paint, so there's no dead window for clicks to fall into.
 */
// Exported so route loaders (in routes.ts, which is plain TS — no JSX, no
// React tree, so useAuth() isn't reachable there) can read the same auth
// snapshot synchronously before a route's Component ever renders.
export function readAuthSnapshot(): AuthState {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<AuthState>;
    if (!parsed.role) return defaultState;
    return {
      role: parsed.role,
      name: parsed.name ?? '',
      documentStep: parsed.documentStep ?? 'pending',
    };
  } catch {
    return defaultState;
  }
}

function clearAllSessionTraces() {
  sessionStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY);
  // Clear any cookies scoped to this app (defensive — this app doesn't set
  // auth cookies itself, but a real backend integration likely will).
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim();
    if (!name) return;
    document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/`;
  });
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(readAuthSnapshot);

  useEffect(() => {
    if (state.role) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [state]);

  const login = (role: Role, name: string) => {
    setState({ role, name, documentStep: 'pending' });
  };

  const logout = () => {
    clearAllSessionTraces();
    setState(defaultState);
  };

  const completeDocumentUpload = () => setState((s) => ({ ...s, documentStep: 'submitted' }));
  const skipDocumentUpload = () => setState((s) => ({ ...s, documentStep: 'skipped' }));

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, completeDocumentUpload, skipDocumentUpload }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
