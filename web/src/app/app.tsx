import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'

import { createQueryClient } from '@/app/query-client'
import { createAppRouter } from '@/app/router'

const queryClient = createQueryClient()
const router = createAppRouter(queryClient)

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)
