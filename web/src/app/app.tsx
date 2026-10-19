import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'

import { createQueryClient } from '@/app/query-client'
import { createAppRouter } from '@/app/router'
import { ThemeProvider } from '@/shared/theme/theme-provider'
import { Toaster } from '@ui/toast'
import { TooltipProvider } from '@ui/tooltip'

const queryClient = createQueryClient()
const router = createAppRouter(queryClient)

export const App = () => (
	<ThemeProvider>
		<TooltipProvider>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
			<Toaster />
		</TooltipProvider>
	</ThemeProvider>
)
