"use client"

import { Star, GitFork, Eye, Users, ExternalLink, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { getLanguageColor } from "@/lib/language-colors"

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

interface RepositoryGridProps {
  repositories: Repository[]
  selectedLanguage: string | "All"
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
          No repositories found. Adjust your search or filters.
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
      <TooltipProvider>
        {repositories.map((repo) => {
          const isHighlighted =
            selectedLanguage === "All" ||
            (repo.language && repo.language === selectedLanguage) ||
            (repo.languages_breakdown && Object.keys(repo.languages_breakdown).includes(selectedLanguage))

          const cardClasses = cn(
            "group transition-all duration-300 border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 flex flex-col h-full",
            "hover:bg-slate-50 dark:hover:bg-slate-800/50", // Added for subtle hover
            {
              "ring-2 ring-blue-500/50 shadow-lg scale-[1.02] bg-blue-50/50 dark:bg-blue-900/10": isHighlighted,
              "opacity-40 scale-[0.98]": selectedLanguage !== "All" && !isHighlighted,
            },
          )

          return (
            <Card
              key={repo.id}
              className={cardClasses}
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
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1" role="list" aria-label="Repository topics">
                      {repo.topics.map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs" role="listitem">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-4 space-y-4">
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex flex-wrap gap-2" role="list" aria-label="Repository languages">
                      {repo.languages_breakdown && Object.keys(repo.languages_breakdown).length > 0 ? (
                        Object.keys(repo.languages_breakdown).map((lang) => (
                          <div
                            key={lang}
                            className={`flex items-center space-x-1 text-xs ${
                              selectedLanguage === lang
                                ? "font-semibold text-blue-600 dark:text-blue-400"
                                : "text-slate-600 dark:text-slate-400"
                            }`}
                            role="listitem"
                            aria-label={`Language: ${lang}`}
                          >
                            <div
                              className={`w-2.5 h-2.5 rounded-full`}
                              style={{ backgroundColor: getLanguageColor(lang) }}
                              aria-hidden="true"
                            />
                            <span>{lang}</span>
                          </div>
                        ))
                      ) : repo.language ? (
                        <div
                          className={`flex items-center space-x-1 text-xs ${
                            selectedLanguage === repo.language
                              ? "font-semibold text-blue-600 dark:text-blue-400"
                              : "text-slate-600 dark:text-slate-400"
                          }`}
                          role="listitem"
                          aria-label={`Primary language: ${repo.language}`}
                        >
                          <div
                            className={`w-2.5 h-2.5 rounded-full`}
                            style={{ backgroundColor: getLanguageColor(repo.language) }}
                            aria-hidden="true"
                          />
                          <span>{repo.language}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 dark:text-slate-500">No languages detected</span>
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
                      {repo.watchers_count > 0 && (
                        <div className="flex items-center space-x-1" role="listitem">
                          <Eye className="h-4 w-4" aria-hidden="true" />
                          <span aria-label={`${repo.watchers_count} watchers`}>{repo.watchers_count}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {repo.contributors && repo.contributors.length > 0 && (
                    <div
                      className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400"
                      role="group"
                      aria-label="Contributors"
                    >
                      <Users className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Contributors:</span>
                      <div className="flex -space-x-2 overflow-hidden">
                        {repo.contributors.map((contributor) => (
                          <Tooltip key={contributor.login}>
                            <TooltipTrigger asChild>
                              <a
                                href={contributor.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative inline-block h-6 w-6 rounded-full ring-2 ring-background hover:z-10 focus:z-10"
                                aria-label={`View ${contributor.login}'s GitHub profile`}
                              >
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={contributor.avatar_url || "/placeholder.svg"}
                                    alt={contributor.login}
                                  />
                                  <AvatarFallback>{contributor.login.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <span>{contributor.login}</span>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-500">
                    <Calendar className="h-3 w-3 mr-1" aria-hidden="true" />
                    <time dateTime={repo.updated_at} aria-label={`Last updated on ${formatDate(repo.updated_at)}`}>
                      Updated {formatDate(repo.updated_at)}
                    </time>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4" role="group" aria-label="Repository actions">
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
      </TooltipProvider>
    </div>
  )
}
