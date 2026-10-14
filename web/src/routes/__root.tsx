import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import type { RouterContext } from '@/app/router'

const RootLayout = () => (
  <>
    <Outlet />
    {import.meta.env.DEV && (
      <>
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <TanStackRouterDevtools position="bottom-right" />
      </>
    )}
  </>
)

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})
