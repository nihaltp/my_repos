import { Suspense } from "react"
import { RepositoryGrid } from "@/components/repository-grid"
import { LoadingSkeleton } from "@/components/loading-skeleton"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">My Repositories</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A collection of my open source projects and contributions
          </p>
        </header>

        <Suspense fallback={<LoadingSkeleton />}>
          <RepositoryGrid />
        </Suspense>
      </div>
    </div>
  )
}
