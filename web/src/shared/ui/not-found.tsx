import { Link } from '@tanstack/react-router'

export const NotFound = () => (
	<main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
		<p className="text-sm font-semibold text-muted-foreground">404</p>
		<h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
		<p className="text-muted-foreground">
			The page you are looking for does not exist or has been moved.
		</p>
		<Link
			to="/"
			className="focus-visible:outline-foreground rounded-sm text-sm font-medium text-foreground underline underline-offset-4 outline-offset-4 hover:no-underline focus-visible:outline-2 active:opacity-70"
		>
			Back to home
		</Link>
	</main>
)
