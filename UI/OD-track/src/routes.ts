import { createBrowserRouter, redirect } from 'react-router';
import type { LoaderFunction } from 'react-router';
import { readAuthSnapshot } from './context/AuthContext';
import type { Role } from './context/AuthContext';

import Login from './pages/auth/Login';
import DocumentUpload from './pages/auth/DocumentUpload';

import StudentDashboard from './pages/student/Dashboard';
import { InternalODBoard, ExternalODBoard } from './pages/student/ODBoard';
import ODCalendar from './pages/student/ODCalendar';

import MentorDashboard from './pages/mentor/Dashboard';
import MentorCalendar from './pages/mentor/Calendar';

import HodDashboard from './pages/hod/Dashboard';
import HodCalendar from './pages/hod/Calendar';

import { NotificationsPage, ProfilePage, ReportsPage } from './pages/StaticPages';

/**
 * This file intentionally contains no JSX — matching this project's
 * existing routes.ts convention (`Component:` references + plain
 * function calls) rather than the `element: <X/>` style. Because of
 * that, the auth/document guards can't be wrapper *components*
 * rendered around an <Outlet/> (that needs JSX + nested layout
 * routes). Instead they're `loader` functions: React Router runs a
 * route's loader *before* rendering its Component, and a loader
 * returning `redirect(...)` short-circuits the render entirely. That
 * gives the same "can't reach a dashboard by typing the URL" guarantee
 * without needing JSX anywhere in this file.
 *
 * `readAuthSnapshot()` reads the same sessionStorage-backed auth state
 * `AuthContext` hydrates from — loaders run outside the React tree, so
 * `useAuth()` isn't reachable here; reading the same underlying
 * storage directly is the only way for a loader to see current auth
 * state.
 */
function guard(allowedRoles: Role[]): LoaderFunction {
  return () => {
    const { role, documentStep } = readAuthSnapshot();

    if (!role) return redirect('/');
    if (!allowedRoles.includes(role)) return redirect(`/${role}`);

    // Mandatory-for-students / skippable-for-staff document step,
    // enforced here so it can't be bypassed by typing a dashboard URL.
    if (role === 'student' && documentStep !== 'submitted') return redirect('/upload');
    if (role !== 'student' && documentStep === 'pending') return redirect('/upload');

    return null;
  };
}

function guardAuthOnly(): LoaderFunction {
  return () => {
    const { role } = readAuthSnapshot();
    if (!role) return redirect('/');
    return null;
  };
}

export const router = createBrowserRouter([
  { path: '/', Component: Login },
  { path: '/upload', Component: DocumentUpload, loader: guardAuthOnly() },

  { path: '/student', Component: StudentDashboard, loader: guard(['student']) },
  { path: '/student/new', Component: StudentDashboard, loader: guard(['student']) },
  { path: '/student/internal', Component: InternalODBoard, loader: guard(['student']) },
  { path: '/student/external', Component: ExternalODBoard, loader: guard(['student']) },
  { path: '/student/calendar', Component: ODCalendar, loader: guard(['student']) },
  { path: '/student/notifications', Component: NotificationsPage, loader: guard(['student']) },
  { path: '/student/profile', Component: ProfilePage, loader: guard(['student']) },

  { path: '/mentor', Component: MentorDashboard, loader: guard(['mentor']) },
  { path: '/mentor/tracking', Component: MentorDashboard, loader: guard(['mentor']) },
  { path: '/mentor/calendar', Component: MentorCalendar, loader: guard(['mentor']) },
  { path: '/mentor/notifications', Component: NotificationsPage, loader: guard(['mentor']) },
  { path: '/mentor/profile', Component: ProfilePage, loader: guard(['mentor']) },

  // Dean removed in full (Phase 3): no /dean path exists anywhere in this
  // table, so there's nothing left for a stale dean link/bookmark to hit.
  { path: '/hod', Component: HodDashboard, loader: guard(['hod']) },
  { path: '/hod/tracking', Component: HodDashboard, loader: guard(['hod']) },
  { path: '/hod/calendar', Component: HodCalendar, loader: guard(['hod']) },
  { path: '/hod/reports', Component: ReportsPage, loader: guard(['hod']) },
  { path: '/hod/notifications', Component: NotificationsPage, loader: guard(['hod']) },
  { path: '/hod/profile', Component: ProfilePage, loader: guard(['hod']) },

  // Catch-all: this is what was actually missing from the original file and
  // is the direct cause of the "Unexpected Application Error! 404 Not Found"
  // page — with no matching route AND no wildcard, that's React Router's own
  // default fallback UI. Redirecting to '/' here means any stale/mistyped
  // URL just bounces home instead of showing that page.
  { path: '*', loader: () => redirect('/') },
]);
