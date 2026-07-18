import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import BottomNav from './bottom-nav'
import LoadingState from './loading-state'
import Sidebar from './sidebar'
import TopBar from './top-bar'

function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background-default lg:flex-row">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 px-5 pt-5 pb-bottom-nav lg:px-10 lg:pb-10">
          <Suspense fallback={<LoadingState />}>
            <div className="mx-auto w-full lg:max-w-7xl">
              <Outlet />
            </div>
          </Suspense>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

export default AppLayout
