import { GitFork, Star, ExternalLink, Calendar, Eye, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Import Avatar components

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
  contributors: Contributor[] | null // Changed to contributors array
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
    SCSS: { bg: "bg-pink-600", border: "border-pink-600" },
    Vue: { bg: "bg-green-400", border: "border-green-400" },
    Svelte: { bg: "bg-red-600", border: "border-red-600" },
    "C#": { bg: "bg-green-700", border: "border-green-700" },
    Perl: { bg: "bg-cyan-700", border: "border-cyan-700" },
    R: { bg: "bg-blue-700", border: "border-blue-700" },
    Scala: { bg: "bg-red-700", border: "border-red-700" },
    Haskell: { bg: "bg-purple-700", border: "border-purple-700" },
    Lua: { bg: "bg-indigo-700", border: "border-indigo-700" },
    Erlang: { bg: "bg-pink-700", border: "border-pink-700" },
    Elixir: { bg: "bg-purple-800", border: "border-purple-800" },
    Clojure: { bg: "bg-red-800", border: "border-red-800" },
    Groovy: { bg: "bg-blue-800", border: "border-blue-800" },
    ObjectiveC: { bg: "bg-blue-900", border: "border-blue-900" },
    Assembly: { bg: "bg-gray-700", border: "border-gray-700" },
    VimL: { bg: "bg-green-800", border: "border-green-800" },
    EmacsLisp: { bg: "bg-purple-900", border: "border-purple-900" },
    Dockerfile: { bg: "bg-blue-950", border: "border-blue-950" },
    Makefile: { bg: "bg-green-900", border: "border-green-900" },
    "Jupyter Notebook": { bg: "bg-orange-700", border: "border-orange-700" },
    "Objective-C++": { bg: "bg-indigo-900", border: "border-indigo-900" },
    "PL/SQL": { bg: "bg-gray-300", border: "border-gray-300" },
    PowerShell: { bg: "bg-blue-900", border: "border-blue-900" },
    Prolog: { bg: "bg-red-900", border: "border-red-900" },
    "Rich Text Format": { bg: "bg-blue-900", border: "border-blue-900" },
    Roff: { bg: "bg-yellow-900", border: "bg-yellow-900" },
    Scheme: { bg: "bg-blue-900", border: "border-blue-900" },
    Smalltalk: { bg: "bg-green-900", border: "border-green-900" },
    Solidity: { bg: "bg-orange-900", border: "border-orange-900" },
    SQL: { bg: "bg-red-900", border: "border-red-900" },
    "Standard ML": { bg: "bg-red-900", border: "border-red-900" },
    Stata: { bg: "bg-blue-900", border: "border-blue-900" },
    Stylus: { bg: "bg-red-900", border: "border-red-900" },
    SuperCollider: { bg: "bg-yellow-900", border: "border-yellow-900" },
    SystemVerilog: { bg: "bg-green-900", border: "border-green-900" },
    Tcl: { bg: "bg-yellow-900", border: "border-yellow-900" },
    Terra: { bg: "bg-gray-900", border: "border-gray-900" },
    Texinfo: { bg: "bg-gray-900", border: "border-gray-900" },
    Thrift: { bg: "bg-gray-900", border: "border-gray-900" },
    TLA: { bg: "bg-gray-900", border: "border-gray-900" },
    TOML: { bg: "bg-gray-900", border: "border-gray-900" },
    TSX: { bg: "bg-blue-900", border: "border-blue-900" },
    Twig: { bg: "bg-purple-900", border: "border-purple-900" },
    UnrealScript: { bg: "bg-red-900", border: "border-red-900" },
    UrWeb: { bg: "bg-gray-900", border: "border-gray-900" },
    V: { bg: "bg-blue-900", border: "border-blue-900" },
    Vala: { bg: "bg-yellow-900", border: "border-yellow-900" },
    VCL: { bg: "bg-gray-900", border: "border-gray-900" },
    Verilog: { bg: "bg-purple-900", border: "border-purple-900" },
    VHDL: { bg: "bg-indigo-900", border: "border-indigo-900" },
    "Vim script": { bg: "bg-green-900", border: "border-green-900" },
    "Visual Basic": { bg: "bg-purple-900", border: "border-purple-900" },
    Volt: { bg: "bg-gray-900", border: "border-gray-900" },
    Vue: { bg: "bg-green-900", border: "border-green-900" },
    WebAssembly: { bg: "bg-teal-900", border: "border-teal-900" },
    WebIDL: { bg: "bg-gray-900", border: "border-gray-900" },
    XAML: { bg: "bg-gray-900", border: "border-gray-900" },
    XC: { bg: "bg-gray-900", border: "border-gray-900" },
    XML: { bg: "bg-gray-900", border: "border-gray-900" },
    Xojo: { bg: "bg-gray-900", border: "border-gray-900" },
    XPages: { bg: "bg-gray-900", border: "border-gray-900" },
    XProc: { bg: "bg-gray-900", border: "border-gray-900" },
    XQuery: { bg: "bg-gray-900", border: "border-gray-900" },
    XS: { bg: "bg-gray-900", border: "border-gray-900" },
    XSLT: { bg: "bg-yellow-900", border: "border-yellow-900" },
    Yacc: { bg: "bg-green-900", border: "border-green-900" },
    YAML: { bg: "bg-red-900", border: "border-red-900" },
    YARA: { bg: "bg-red-900", border: "border-red-900" },
    Zephir: { bg: "bg-cyan-900", border: "border-cyan-900" },
    Zig: { bg: "bg-yellow-900", border: "border-yellow-900" },
    ZIL: { bg: "bg-gray-900", border: "border-gray-900" },
    ZPL: { bg: "bg-gray-900", border: "border-gray-900" },
    Zsh: { bg: "bg-gray-900", border: "border-gray-900" },
  }

  // Simple hash function to generate a color if not found
  let hash = 0
  const str = language || ""
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = "#"
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ("00" + value.toString(16)).substr(-2)
  }

  return colors[language || ""] || { bg: `bg-[${color}]`, border: `border-[${color}]` }
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
        const isHighlighted =
          selectedLanguage &&
          ((repo.language && repo.language === selectedLanguage) ||
            (repo.languages_breakdown && Object.keys(repo.languages_breakdown).includes(selectedLanguage)))
        const isOtherLanguage = selectedLanguage && !isHighlighted // Simplified logic for other languages

        return (
          <Card
            key={repo.id}
            className={`group transition-all duration-300 border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 flex flex-col h-full ${
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
                    {repo.topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs" role="listitem">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Language, Stats, and Updated date - Moved to bottom */}
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
                            className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(lang).bg} ${
                              selectedLanguage === lang ? "ring-1 ring-blue-500/50" : ""
                            }`}
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
                          className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(repo.language).bg} ${
                            selectedLanguage === repo.language ? "ring-1 ring-blue-500/50" : ""
                          }`}
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

                {/* Contributors */}
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
                        <a
                          key={contributor.login}
                          href={contributor.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative inline-block h-6 w-6 rounded-full ring-2 ring-background hover:z-10 focus:z-10"
                          aria-label={`View ${contributor.login}'s GitHub profile`}
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={contributor.avatar_url || "/placeholder.svg"} alt={contributor.login} />
                            <AvatarFallback>{contributor.login.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        </a>
                      ))}
                    </div>
                    {/* Optional: Add a "+X more" if there are more contributors than displayed */}
                    {/* This would require knowing the total count, which is not directly available from the limited fetch */}
                  </div>
                )}

                {/* Updated date */}
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-500">
                  <Calendar className="h-3 w-3 mr-1" aria-hidden="true" />
                  <time dateTime={repo.updated_at} aria-label={`Last updated on ${formatDate(repo.updated_at)}`}>
                    Updated {formatDate(repo.updated_at)}
                  </time>
                </div>
              </div>

              {/* Actions */}
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
    </div>
  )
}
