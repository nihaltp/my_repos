"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface Repository {
  id: number
  name: string
  language: string | null
  private: boolean
  languages_breakdown: Record<string, number> | null // Updated interface
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
    SCSS: "#c6538c",
    Vue: "#42b883",
    Svelte: "#ff3e00",
    "C#": "#178600",
    Perl: "#0298c3",
    R: "#198ce7",
    Scala: "#c22d40",
    Haskell: "#5e5086",
    Lua: "#000080",
    Erlang: "#B83998",
    Elixir: "#6e4a7e",
    Clojure: "#db5855",
    Groovy: "#4298b8",
    ObjectiveC: "#438eff",
    Assembly: "#6E4C13",
    VimL: "#199f4b",
    EmacsLisp: "#c065db",
    Dockerfile: "#384d54",
    Makefile: "#427819",
    "Jupyter Notebook": "#DA5B0B",
    "Objective-C++": "#6866fb",
    "PL/SQL": "#dad8d8",
    PowerShell: "#012456",
    Prolog: "#74283c",
    "Rich Text Format": "#2b5876",
    Roff: "#ecdebe",
    Scheme: "#1e4aec",
    Smalltalk: "#596706",
    Solidity: "#AA6746",
    SQL: "#c75627",
    "Standard ML": "#dc566d",
    Stata: "#1a5f95",
    Stylus: "#ff6347",
    Tcl: "#e4cc98",
    TeX: "#3d6117",
    VHDL: "#adb2cb",
    Verilog: "#848bf3",
    Vimscript: "#199f4b",
    WebAssembly: "#044B53",
    XSLT: "#bc8c00",
    Zephir: "#118f9e",
    Zig: "#fcd700",
    "Common Lisp": "#3fb68b",
    "F#": "#b845fc",
    Fortran: "#4d41b1",
    Julia: "#a270ba",
    VBA: "#867db1",
    "Visual Basic .NET": "#945db7",
    "ASP.NET": "#945db7",
    CoffeeScript: "#244776",
    Crystal: "#000100",
    D: "#ba5959",
    Eiffel: "#946d57",
    Fantom: "#dbded3",
    FreeMarker: "#0050b2",
    Gherkin: "#5B2063",
    GLSL: "#5686A4",
    Hack: "#878787",
    Haxe: "#df7900",
    Hy: "#7790B2",
    Idris: "#b30000",
    "Inform 7": "#c75627",
    Io: "#a0b3f0",
    J: "#946d57",
    JSON: "#292929",
    JSON5: "#292929",
    JSONiq: "#40d47e",
    JSX: "#61DAFB",
    KRL: "#28430B",
    LabVIEW: "#FD8532",
    Lasso: "#999999",
    Less: "#1D365D",
    Lex: "#DBCA00",
    LFE: "#004200",
    LiveScript: "#499886",
    Logtalk: "#295b9d",
    LookML: "#652B81",
    M4: "#6E4C13",
    Mathematica: "#dd1100",
    Matlab: "#e16737",
    Max: "#c4c7c7",
    Mercury: "#ff2b2b",
    Meson: "#007800",
    Mirah: "#c7a938",
    Modelica: "#de1d31",
    "Modula-2": "#000000",
    Monkey: "#fd1200",
    MoonScript: "#8a1267",
    MQL4: "#62A8D6",
    MQL5: "#4066B5",
    NCL: "#28430B",
    Nemerle: "#3d3c6e",
    NetLinx: "#02528e",
    Nim: "#37775b",
    Nix: "#7827B4",
    NSIS: "#000000",
    Nu: "#c9df40",
    Nunjucks: "#3d8137",
    OCaml: "#3be133",
    Omegle: "#000000",
    OpenCL: "#000000",
    "OpenEdge ABL": "#596706",
    OpenSCAD: "#0060B6",
    Org: "#77AA99",
    Ox: "#000000",
    Oxygene: "#5A6E84",
    Oz: "#000000",
    P4: "#7055B5",
    Pan: "#cc0000",
    Papyrus: "#6600cc",
    Parrot: "#f34b7d",
    Pascal: "#E3F171",
    Pawn: "#7055B5",
    "Perl 6": "#000000",
    Pike: "#005390",
    PogoScript: "#d80074",
    Pony: "#000000",
    PostCSS: "#dc3a0c",
    PostScript: "#da291c",
    "POV-Ray SDL": "#3572A5",
    Processing: "#000000",
    "Propeller Spin": "#755599",
    "Protocol Buffer": "#000000",
    "Public Key Infrastructure": "#000000",
    Puppet: "#302B6D",
    PureBasic: "#5393B4",
    PureScript: "#1D222D",
    "Python console": "#3572A5",
    QML: "#40d47e",
    Racket: "#22228f",
    Raku: "#000000",
    Rascal: "#ffc467",
    Reason: "#ff5847",
    Rebol: "#3586A0",
    Red: "#f50000",
    RenderScript: "#000000",
    Roff: "#ecdebe",
    RPL: "#000000",
    "RPM Spec": "#7389D8",
    RubyGems: "#701516",
    Sage: "#000000",
    SaltStack: "#646464",
    SAS: "#B34936",
    Scheme: "#1e4aec",
    Scilab: "#000000",
    Self: "#000000",
    ShaderLab: "#5284B6",
    Smarty: "#F0C040",
    SourcePawn: "#5c5c5c",
    SQF: "#3F3F3F",
    Squirrel: "#800000",
    "Standard ML": "#dc566d",
    Stata: "#1a5f95",
    Stylus: "#ff6347",
    Tcl: "#e4cc98",
    TeX: "#3d6117",
    Terra: "#000000",
    Texinfo: "#000000",
    Thrift: "#000000",
    TLA: "#000000",
    TOML: "#999999",
    TSX: "#3178c6",
    Twig: "#8a1267",
    UnrealScript: "#a54c4d",
    UrWeb: "#000000",
    V: "#4f87c4",
    Vala: "#fbe5cd",
    VCL: "#000000",
    Verilog: "#848bf3",
    VHDL: "#adb2cb",
    "Vim script": "#199f4b",
    "Visual Basic": "#945db7",
    Volt: "#1F1F1F",
    Vue: "#42b883",
    WebAssembly: "#044B53",
    WebIDL: "#000000",
    XAML: "#000000",
    XC: "#999999",
    XML: "#000000",
    Xojo: "#000000",
    XPages: "#000000",
    XProc: "#000000",
    XQuery: "#000000",
    XS: "#000000",
    XSLT: "#bc8c00",
    Yacc: "#4B6C4B",
    YAML: "#cb171e",
    YARA: "#220000",
    Zephir: "#118f9e",
    Zig: "#fcd700",
    ZIL: "#000000",
    ZPL: "#000000",
    Zsh: "#888888",
  }

  // Simple hash function to generate a color if not found
  let hash = 0
  for (let i = 0; i < language.length; i++) {
    hash = language.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = "#"
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ("00" + value.toString(16)).substr(-2)
  }

  return colors[language] || color
}

function processLanguageStats(repositories: Repository[]): LanguageStats[] {
  const publicRepos = repositories.filter((repo) => !repo.private)

  // Count languages and collect repository names
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
      // Fallback to primary language if breakdown is not available
      if (!languageData[repo.language]) {
        languageData[repo.language] = { count: 0, repositories: [], bytes: 0 }
      }
      languageData[repo.language].count++
      languageData[repo.language].repositories.push(repo.name)
      // Cannot determine bytes for fallback, so keep it 0 or estimate if needed
    }
  })

  // Convert to array and calculate percentages based on bytes for more accurate distribution
  const totalUniqueRepos = publicRepos.length
  const languageStats: LanguageStats[] = Object.entries(languageData)
    .map(([language, data]) => ({
      language,
      count: data.count,
      percentage: totalUniqueRepos > 0 ? (data.count / totalUniqueRepos) * 100 : 0, // Calculate percentage based on bytes
      color: getLanguageColor(language),
      repositories: data.repositories.sort(),
    }))
    .sort((a, b) => b.count - a.count) // Sort by percentage

  return languageStats
}

export function LanguageStats({ repositories, selectedLanguage, onLanguageSelect }: LanguageStatsProps) {
  const languageStats = processLanguageStats(repositories)

  if (languageStats.length === 0) {
    return null
  }

  const maxPercentage = Math.max(...languageStats.map((stat) => stat.percentage))

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
                        width: `${stat.percentage}%`, // Use percentage directly
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
              <span>Total repositories: {repositories.length}</span>
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
