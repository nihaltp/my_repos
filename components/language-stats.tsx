"use client"

import { Badge } from "@/components/ui/badge"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { getLanguageColor } from "@/lib/language-colors"

interface Repository {
  id: number
  name: string
  language: string | null
  private: boolean
  languages_breakdown: Record<string, number> | null
}

interface LanguageStatsData {
  language: string
  count: number
  percentage: number
  color: string
  repositories: string[]
}

interface LanguageStatsProps {
  repositories: Repository[]
  selectedLanguage: string | "All"
  onLanguageSelect: (language: string | "All") => void
}

function processLanguageStats(repositories: Repository[]): LanguageStatsData[] {
  const publicRepos = repositories.filter((repo) => !repo.private)

  const languageData: Record<string, { count: number; repositories: string[]; bytes: number }> = {}
  publicRepos.forEach((repo) => {
    if (repo.languages_breakdown) {
      for (const lang in repo.languages_breakdown) {
        const bytes = repo.languages_breakdown[lang]
        if (!languageData[lang]) {
          languageData[lang] = { count: 0, repositories: [], bytes: 0 }
        }
        languageData[lang].count++
        languageData[lang].repositories.push(repo.name)
        languageData[lang].bytes += bytes
      }
    } else if (repo.language) {
      if (!languageData[repo.language]) {
        languageData[repo.language] = { count: 0, repositories: [], bytes: 0 }
      }
      languageData[repo.language].count++
      languageData[repo.language].repositories.push(repo.name)
    }
  })

  const totalUniqueRepos = publicRepos.length
  const languageStats: LanguageStatsData[] = Object.entries(languageData)
    .map(([language, data]) => ({
      language,
      count: data.count,
      percentage: totalUniqueRepos > 0 ? (data.count / totalUniqueRepos) * 100 : 0,
      color: getLanguageColor(language),
      repositories: data.repositories.sort(),
    }))
    .sort((a, b) => b.count - a.count)

  return languageStats
}

export function LanguageStats({ repositories, selectedLanguage, onLanguageSelect }: LanguageStatsProps) {
  const languageStats = useMemo(() => processLanguageStats(repositories), [repositories])

  if (languageStats.length === 0) {
    return null
  }

  const handleLanguageClick = (language: string) => {
    if (selectedLanguage === language) {
      onLanguageSelect("All")
    } else {
      onLanguageSelect(language)
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
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: stat.color }}
                    aria-hidden="true"
                  />
                  <span className="font-medium text-slate-900 dark:text-slate-100 truncate">{stat.language}</span>
                </div>

                <div className="flex items-center space-x-4 flex-1 max-w-md mx-4">
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <Progress
                      value={stat.percentage}
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      indicatorColor={stat.color} // Pass the language color here
                      aria-label={`${stat.percentage.toFixed(1)}% of repositories`}
                    />
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400 min-w-[3rem] text-right">
                    {stat.percentage.toFixed(1)}%
                  </span>
                </div>

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

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>Total languages: {languageStats.length}</span>
              <span>Total repositories: {repositories.length}</span>
            </div>
            {selectedLanguage !== "All" && (
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
