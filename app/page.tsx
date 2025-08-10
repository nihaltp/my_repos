import { Suspense } from "react"
import { RepositoryDashboard } from "@/components/repository-dashboard"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { UsernameInput } from "@/components/username-input"

interface Contributor {
  login: string
  avatar_url: string
  html_url: string
}

interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  watchers_count: number
  forks_count: number
  created_at: string
  updated_at: string
  topics: string[]
  private: boolean
  languages_url: string
  languages_breakdown: Record<string, number> | null
  contributors_url: string
  contributors: Contributor[] | null
}

async function getRepositories(username: string): Promise<Repository[]> {
  if (!username) {
    throw new Error("GitHub username is missing. Please provide it in the URL, e.g., /?username=your-github-username.")
  }

  // No Authorization header as per user request.
  // Be aware of GitHub API rate limits for unauthenticated requests (60 requests per hour).
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Repository-Dashboard",
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      headers,
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(
          "GitHub API rate limit exceeded. Please wait a while or try again later. Unauthenticated requests are limited to 60 per hour.",
        )
      }
      if (response.status === 404) {
        throw new Error(`GitHub user "${username}" not found. Please check the username and try again.`)
      }
      throw new Error(`GitHub API error: ${response.status} - ${response.statusText}`)
    }

    const repos: Repository[] = await response.json()
    const publicRepos = repos.filter((repo: Repository) => !repo.private)

    const reposWithDetails = await Promise.all(
      publicRepos.map(async (repo) => {
        let languages_breakdown: Record<string, number> | null = null
        let contributors: Contributor[] | null = null

        try {
          const langResponse = await fetch(repo.languages_url, { headers })
          if (langResponse.ok) {
            languages_breakdown = await langResponse.json()
          } else {
            console.warn(`Failed to fetch languages for ${repo.name}: ${langResponse.status}`)
          }
        } catch (langError) {
          console.error(`Error fetching languages for ${repo.name}:`, langError)
        }

        try {
          const contributorsResponse = await fetch(`${repo.contributors_url}?per_page=5`, { headers })
          if (contributorsResponse.ok) {
            const fetchedContributors: any[] = await contributorsResponse.json()
            contributors = fetchedContributors.map((c) => ({
              login: c.login,
              avatar_url: c.avatar_url,
              html_url: c.html_url,
            }))
          } else {
            console.warn(`Failed to fetch contributors for ${repo.name}: ${contributorsResponse.status}`)
          }
        } catch (contributorError) {
          console.error(`Error fetching contributors for ${repo.name}:`, contributorError)
        }

        return { ...repo, languages_breakdown, contributors }
      }),
    )

    reposWithDetails.sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count
      }
      if (b.forks_count !== a.forks_count) {
        return b.forks_count - a.forks_count
      }
      if (b.watchers_count !== a.watchers_count) {
        return b.watchers_count - a.watchers_count
      }
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })

    return reposWithDetails
  } catch (error: any) {
    console.error("Error fetching repositories:", error.message)
    throw error
  }
}

function LanguageStatsLoading() {
  return (
    <Card className="mb-8 border-slate-200 dark:border-slate-700">
      <CardContent className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-4 h-4 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center space-x-4 flex-1 max-w-md mx-4">
                <Skeleton className="flex-1 h-2 rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

async function RepositoryDashboardWrapper({ searchParams }: { searchParams: Promise<{ username?: string }> }) {
  let repositories: Repository[] = []
  let error: string | null = null
  const resolvedSearchParams = await searchParams
  const username = resolvedSearchParams.username || ""

  try {
    repositories = await getRepositories(username)
  } catch (e: any) {
    error = e.message
  }

  if (error) {
    return (
      <div className="text-center py-12" role="alert" aria-live="assertive">
        <p className="text-red-600 dark:text-red-400 text-lg font-semibold mb-4">Error Loading Repositories:</p>
        <p className="text-slate-700 dark:text-slate-300 text-base max-w-2xl mx-auto">{error}</p>
        {error.includes("rate limit") && (
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-4">
            You've hit the unauthenticated GitHub API rate limit. Please wait an hour or consider deploying with a
            `GITHUB_TOKEN` for higher limits.
          </p>
        )}
      </div>
    )
  }

  if (repositories.length === 0) {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          No public repositories found for the GitHub username "{username}".
        </p>
      </div>
    )
  }

  return <RepositoryDashboard repositories={repositories} />
}

export default async function Home({ searchParams }: { searchParams: { username?: string } }) {
  const username = searchParams.username

  // If no username is provided, show the username input form
  if (!username) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">GitHub Repository Dashboard</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Enter a GitHub username to view their public repositories and language distribution.
            </p>
          </header>

          <UsernameInput />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">{`${username}'s Repositories`}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A collection of open source projects and contributions.
          </p>
          <div className="mt-4">
            <UsernameInput currentUsername={username} />
          </div>
        </header>

        <Suspense
          fallback={
            <>
              <LanguageStatsLoading />
              <LoadingSkeleton />
            </>
          }
        >
          <RepositoryDashboardWrapper searchParams={searchParams} />
        </Suspense>

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
      </div>
    </div>
  )
}