import { Link } from '@tanstack/react-router'

export const NotFound = () => (
  <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
    <p className="text-sm font-semibold text-brand-600">404</p>
    <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
    <p className="text-fg-muted">The page you are looking for does not exist or has been moved.</p>
    <Link to="/" className="text-sm font-medium text-brand-600 hover:underline">
      Back to home
    </Link>
  </main>
)
