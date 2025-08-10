"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Search } from "lucide-react"

interface UsernameInputProps {
  currentUsername?: string
}

export function UsernameInput({ currentUsername }: UsernameInputProps) {
  const [username, setUsername] = useState(currentUsername || "")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsLoading(true)

    // Navigate to the same path with the username parameter
    const currentPath = window.location.pathname
    const newUrl = `${currentPath}?username=${encodeURIComponent(username.trim())}`

    router.push(newUrl)
  }

  const handleExampleClick = (exampleUsername: string) => {
    setUsername(exampleUsername)
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Github className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-xl font-semibold">
            {currentUsername ? "Switch User" : "Enter GitHub Username"}
          </CardTitle>
          <CardDescription>
            {currentUsername
              ? "Enter a different GitHub username to view their repositories"
              : "View public repositories and language statistics for any GitHub user"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                GitHub Username
              </label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="e.g., nihaltp"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={!username.trim() || isLoading}>
              {isLoading ? "Loading..." : currentUsername ? "Switch User" : "View Repositories"}
            </Button>
          </form>

          {!currentUsername && (
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {["nihaltp", "torvalds", "gaearon", "sindresorhus"].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => handleExampleClick(example)}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
