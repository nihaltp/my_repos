"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface Repository {
  id: number
  name: string
  language: string | null
  private: boolean
}

interface LanguageStats {
  language: string
  count: number
  percentage: number
  color: string
  repositories: string[]
}

interface LanguageStatsProps {
  repositories: Repository[]
  selectedLanguage: string | null
  onLanguageSelect: (language: string | null) => void
}

function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    Go: "#00ADD8",
    Rust: "#dea584",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Swift: "#fa7343",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#1572B6",
    Shell: "#89e051",
  }
  return colors[language] || "#6b7280"
}

function processLanguageStats(repositories: Repository[]): LanguageStats[] {
  const publicRepos = repositories.filter((repo) => !repo.private)

  // Count languages and collect repository names
  const languageData: Record<string, { count: number; repositories: string[] }> = {}
  publicRepos.forEach((repo) => {
    if (repo.language) {
      if (!languageData[repo.language]) {
        languageData[repo.language] = { count: 0, repositories: [] }
      }
      languageData[repo.language].count++
      languageData[repo.language].repositories.push(repo.name)
    }
  })

  // Convert to array and calculate percentages
  const totalRepos = Object.values(languageData).reduce((sum, data) => sum + data.count, 0)
  const languageStats: LanguageStats[] = Object.entries(languageData)
    .map(([language, data]) => ({
      language,
      count: data.count,
      percentage: (data.count / totalRepos) * 100,
      color: getLanguageColor(language),
      repositories: data.repositories.sort(),
    }))
    .sort((a, b) => b.count - a.count)

  return languageStats
}

export function LanguageStats({ repositories, selectedLanguage, onLanguageSelect }: LanguageStatsProps) {
  const languageStats = processLanguageStats(repositories)

  if (languageStats.length === 0) {
    return null
  }

  const maxCount = Math.max(...languageStats.map((stat) => stat.count))

  const handleLanguageClick = (language: string) => {
    if (selectedLanguage === language) {
      onLanguageSelect(null) // Deselect if already selected
    } else {
      onLanguageSelect(language) // Select new language
    }
  }

  return (
    <TooltipProvider>
      <Card className="mb-8 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Language Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {languageStats.map((stat) => (
              <div
                key={stat.language}
                className={`flex items-center justify-between group rounded-lg p-3 transition-all cursor-pointer ${
                  selectedLanguage === stat.language
                    ? "bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/50"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
                onClick={() => handleLanguageClick(stat.language)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleLanguageClick(stat.language)
                  }
                }}
                aria-label={`${stat.language}: ${stat.count} repositories. Click to ${
                  selectedLanguage === stat.language ? "deselect" : "highlight"
                } related repositories.`}
              >
                {/* Language name and color indicator */}
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: stat.color }}
                    aria-hidden="true"
                  />
                  <span className="font-medium text-slate-900 dark:text-slate-100 truncate">{stat.language}</span>
                </div>

                {/* Progress bar */}
                <div className="flex items-center space-x-4 flex-1 max-w-md mx-4">
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        backgroundColor: stat.color,
                        width: `${(stat.count / maxCount) * 100}%`,
                      }}
                      aria-label={`${stat.percentage.toFixed(1)}% of repositories`}
                    />
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400 min-w-[3rem] text-right">
                    {stat.percentage.toFixed(1)}%
                  </span>
                </div>

                {/* Repository count with tooltip */}
                <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="secondary"
                        className={`font-mono text-sm transition-all ${
                          selectedLanguage === stat.language ? "ring-2 ring-blue-500/50" : ""
                        }`}
                        style={{
                          backgroundColor: `${stat.color}20`,
                          color: stat.color,
                          borderColor: `${stat.color}40`,
                        }}
                      >
                        {stat.count} {stat.count === 1 ? "repo" : "repos"}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <div className="space-y-1">
                        <p className="font-semibold text-sm">{stat.language} repositories:</p>
                        <div className="text-xs space-y-0.5">
                          {stat.repositories.map((repoName) => (
                            <div key={repoName} className="text-slate-600 dark:text-slate-300">
                              {repoName}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>Total languages: {languageStats.length}</span>
              <span>Total repositories: {languageStats.reduce((sum, stat) => sum + stat.count, 0)}</span>
            </div>
            {selectedLanguage && (
              <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                Highlighting {selectedLanguage} repositories below. Click again to clear selection.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
