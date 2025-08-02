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
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          No repositories found. Make sure to set your GitHub username in the environment variables.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repositories.map((repo) => (
        <Card
          key={repo.id}
          className="group hover:shadow-lg transition-all duration-200 border-slate-200 dark:border-slate-700"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {repo.name}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {repo.description || "No description available"}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                asChild
              >
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Topics */}
              {repo.topics && repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {repo.topics.slice(0, 3).map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {repo.topics.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{repo.topics.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Language and Stats */}
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-4">
                  {repo.language && (
                    <div className="flex items-center space-x-1">
                      <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`} />
                      <span>{repo.language}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {repo.stargazers_count > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                  )}
                  {repo.forks_count > 0 && (
                    <div className="flex items-center space-x-1">
                      <GitFork className="h-4 w-4" />
                      <span>{repo.forks_count}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Updated date */}
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-500">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Updated {formatDate(repo.updated_at)}</span>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    View Code
                  </a>
                </Button>
                {repo.homepage && (
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                    <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
