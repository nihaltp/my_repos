import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingSkeleton() {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      role="status"
      aria-live="polite"
      aria-label="Loading repositories"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="border-slate-200 dark:border-slate-700 flex flex-col h-full">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" aria-label="Loading repository title" />
              <Skeleton className="h-4 w-full" aria-label="Loading repository description" />
              <Skeleton className="h-4 w-2/3" aria-label="Loading repository details" />
            </div>
          </CardHeader>
          <CardContent className="pt-0 flex flex-col flex-1">
            <div className="space-y-4 flex-1">
              <div className="flex space-x-2">
                <Skeleton className="h-5 w-16" aria-label="Loading topic" />
                <Skeleton className="h-5 w-20" aria-label="Loading topic" />
                <Skeleton className="h-5 w-14" aria-label="Loading topic" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" aria-label="Loading language" />
                <div className="flex space-x-3">
                  <Skeleton className="h-4 w-8" aria-label="Loading stars" />
                  <Skeleton className="h-4 w-8" aria-label="Loading forks" />
                </div>
              </div>
              <Skeleton className="h-4 w-32" aria-label="Loading update date" />
            </div>
            <div className="flex space-x-2 pt-4 mt-auto">
              <Skeleton className="h-8 flex-1" aria-label="Loading action button" />
              <Skeleton className="h-8 flex-1" aria-label="Loading action button" />
            </div>
          </CardContent>
        </Card>
      ))}
      <span className="sr-only">Loading your repositories, please wait...</span>
    </div>
  )
}
