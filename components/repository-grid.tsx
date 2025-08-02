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

interface RepositoryGridProps {
  repositories: Repository[]
  selectedLanguage: string | null
}

function getLanguageColor(language: string | null): { bg: string; border: string } {
  const colors: Record<string, { bg: string; border: string }> = {
    JavaScript: { bg: "bg-yellow-500", border: "border-yellow-500" },
    TypeScript: { bg: "bg-blue-500", border: "border-blue-500" },
    Python: { bg: "bg-green-500", border: "border-green-500" },
    Java: { bg: "bg-orange-500", border: "border-orange-500" },
    "C++": { bg: "bg-pink-500", border: "border-pink-500" },
    C: { bg: "bg-gray-600", border: "border-gray-600" },
    Go: { bg: "bg-cyan-500", border: "border-cyan-500" },
    Rust: { bg: "bg-orange-600", border: "border-orange-600" },
    PHP: { bg: "bg-purple-500", border: "border-purple-500" },
    Ruby: { bg: "bg-red-500", border: "border-red-500" },
    Swift: { bg: "bg-orange-400", border: "border-orange-400" },
    Kotlin: { bg: "bg-purple-600", border: "border-purple-600" },
    Dart: { bg: "bg-blue-400", border: "border-blue-400" },
    HTML: { bg: "bg-orange-600", border: "border-orange-600" },
    CSS: { bg: "bg-blue-600", border: "border-blue-600" },
    Shell: { bg: "bg-gray-500", border: "border-gray-500" },
  }

  return colors[language || ""] || { bg: "bg-gray-400", border: "border-gray-400" }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function RepositoryGrid({ repositories, selectedLanguage }: RepositoryGridProps) {
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
      {repositories.map((repo) => {
        const isHighlighted = selectedLanguage && repo.language === selectedLanguage
        const isOtherLanguage = selectedLanguage && repo.language !== selectedLanguage

        return (
          <Card
            key={repo.id}
            className={`group transition-all duration-300 border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 flex flex-col h-full ${
              repo.language ? `border-l-4 ${getLanguageColor(repo.language).border}` : ""
            } ${
              isHighlighted
                ? "ring-2 ring-blue-500/50 shadow-lg scale-[1.02] bg-blue-50/50 dark:bg-blue-900/10"
                : isOtherLanguage
                  ? "opacity-40 scale-[0.98]"
                  : "hover:shadow-lg"
            }`}
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
                        className={`flex items-center space-x-1 ${
                          isHighlighted ? "font-semibold text-blue-600 dark:text-blue-400" : ""
                        }`}
                        role="img"
                        aria-label={`Primary language: ${repo.language}`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language).bg} ${
                            isHighlighted ? "ring-2 ring-blue-500/50" : ""
                          }`}
                          aria-hidden="true"
                        />
                        <span>{repo.language}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3" role="list" aria-label="Repository statistics">
                    {repo.stargazers_count > 0 && (
                      <div className="flex items-center space-x-1" role="listitem">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" aria-hidden="true" />
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
                    className="no-underline"
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
                      className="no-underline"
                    >
                      Live Demo
                      <span className="sr-only"> for {repo.name}</span>
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
