import { GitFork, Star, ExternalLink, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
}

async function getRepositories(): Promise<Repository[]> {
  // Replace 'username' with your GitHub username or use environment variable
  const username = process.env.GITHUB_USERNAME || "octocat"
  const token = process.env.GITHUB_TOKEN // Optional: for private repos or higher rate limits

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Repository-Dashboard",
  }

  if (token) {
    headers["Authorization"] = `token ${token}`
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      headers,
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const repos = await response.json()
    return repos.filter((repo: Repository) => !repo.private) // Only show public repos by default
  } catch (error) {
    console.error("Error fetching repositories:", error)
    return []
  }
}

function getLanguageColor(language: string | null): string {
  const colors: Record<string, string> = {
    JavaScript: "bg-yellow-500",
    TypeScript: "bg-blue-500",
    Python: "bg-green-500",
    Java: "bg-orange-500",
    "C++": "bg-pink-500",
    C: "bg-gray-600",
    Go: "bg-cyan-500",
    Rust: "bg-orange-600",
    PHP: "bg-purple-500",
    Ruby: "bg-red-500",
    Swift: "bg-orange-400",
    Kotlin: "bg-purple-600",
    Dart: "bg-blue-400",
    HTML: "bg-orange-600",
    CSS: "bg-blue-600",
    Shell: "bg-gray-500",
  }

  return colors[language || ""] || "bg-gray-400"
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export async function RepositoryGrid() {
  const repositories = await getRepositories()

  if (repositories.length === 0) {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          No repositories found. Make sure to set your GitHub username in the environment variables.
        </p>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      role="main"
      aria-label={`${repositories.length} repositories`}
    >
      {repositories.map((repo) => (
        <Card
          key={repo.id}
          className="group hover:shadow-lg transition-all duration-200 border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 flex flex-col h-full"
          role="article"
          aria-labelledby={`repo-title-${repo.id}`}
          aria-describedby={`repo-desc-${repo.id}`}
        >
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle
                  id={`repo-title-${repo.id}`}
                  className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate"
                >
                  {repo.name}
                </CardTitle>
                <CardDescription
                  id={`repo-desc-${repo.id}`}
                  className="text-sm text-slate-600 dark:text-slate-400 mt-1"
                >
                  {repo.description || "No description available"}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity ml-2 flex-shrink-0"
                asChild
                aria-label={`View ${repo.name} repository on GitHub`}
              >
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-describedby={`repo-title-${repo.id}`}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Open in new tab</span>
                </a>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-0 flex flex-col flex-1">
            <div className="space-y-4 flex-1">
              {/* Topics */}
              {repo.topics && repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1" role="list" aria-label="Repository topics">
                  {repo.topics.slice(0, 3).map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs" role="listitem">
                      {topic}
                    </Badge>
                  ))}
                  {repo.topics.length > 3 && (
                    <Badge
                      variant="outline"
                      className="text-xs"
                      role="listitem"
                      aria-label={`${repo.topics.length - 3} more topics`}
                    >
                      +{repo.topics.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Language and Stats */}
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-4">
                  {repo.language && (
                    <div
                      className="flex items-center space-x-1"
                      role="img"
                      aria-label={`Primary language: ${repo.language}`}
                    >
                      <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`} aria-hidden="true" />
                      <span>{repo.language}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3" role="list" aria-label="Repository statistics">
                  {repo.stargazers_count > 0 && (
                    <div className="flex items-center space-x-1" role="listitem">
                      <Star className="h-4 w-4" aria-hidden="true" />
                      <span aria-label={`${repo.stargazers_count} stars`}>{repo.stargazers_count}</span>
                    </div>
                  )}
                  {repo.forks_count > 0 && (
                    <div className="flex items-center space-x-1" role="listitem">
                      <GitFork className="h-4 w-4" aria-hidden="true" />
                      <span aria-label={`${repo.forks_count} forks`}>{repo.forks_count}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Updated date */}
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-500">
                <Calendar className="h-3 w-3 mr-1" aria-hidden="true" />
                <time dateTime={repo.updated_at} aria-label={`Last updated on ${formatDate(repo.updated_at)}`}>
                  Updated {formatDate(repo.updated_at)}
                </time>
              </div>
            </div>

            {/* Actions - This will be pushed to the bottom */}
            <div className="flex space-x-2 pt-4 mt-auto" role="group" aria-label="Repository actions">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View source code for ${repo.name}`}
                >
                  View Code
                  <span className="sr-only"> for {repo.name}</span>
                </a>
              </Button>
              {repo.homepage && (
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                  <a
                    href={repo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View live demo for ${repo.name}`}
                  >
                    Live Demo
                    <span className="sr-only"> for {repo.name}</span>
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
