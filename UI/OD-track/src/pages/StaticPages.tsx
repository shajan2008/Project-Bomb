import PlaceholderPage from './PlaceholderPage';

// React Router's `Component:` route field calls the component with no props,
// so a single parametrized <PlaceholderPage title="..."/> can't be wired in
// directly from a JSX-free routes.ts. These thin, prop-free wrappers exist
// only so routes.ts can reference them via `Component: NotificationsPage`.
export function NotificationsPage() {
  return <PlaceholderPage title="Notifications" />;
}

export function ProfilePage() {
  return <PlaceholderPage title="Profile" />;
}

export function ReportsPage() {
  return <PlaceholderPage title="Reports" />;
}
