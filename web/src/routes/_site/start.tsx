import { createFileRoute, Link } from '@tanstack/react-router'

import { buttonVariants } from '@ui/button-variants'

const StartPage = () => (
	<div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
		<h1 className="font-heading text-3xl leading-tight font-semibold tracking-[-0.02em] text-balance">
			Sign in or create an account
		</h1>
		<p className="text-muted-foreground text-pretty">
			Signing in with your phone number and a code by SMS is not built yet (ACC-02, ACC-03).
		</p>
		<Link to="/home" className={buttonVariants({ size: 'lg' })}>
			Open the app preview
		</Link>
	</div>
)

export const Route = createFileRoute('/_site/start')({
	component: StartPage,
})
