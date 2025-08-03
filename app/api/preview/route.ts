import { type NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer-core"
import chromium from "@sparticvs/chromium"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const username = searchParams.get("username")

  if (!username) {
    return new NextResponse(
      "Please provide a GitHub username in the URL, e.g., /api/preview?username=your-github-username",
      {
        status: 400,
        headers: { "Content-Type": "text/plain" },
      },
    )
  }

  let browser = null
  try {
    // VERCEL_URL is automatically provided by Vercel in deployed environments.
    // For local development, it defaults to localhost:3000.
    const VERCEL_URL = process.env.VERCEL_URL || "localhost:3000"
    const protocol = VERCEL_URL.startsWith("localhost") ? "http" : "https"
    const targetUrl = `${protocol}://${VERCEL_URL}/?username=${username}`

    console.log(`Attempting to screenshot: ${targetUrl}`)

    // Launch the headless Chromium browser
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless, // Use chromium's headless setting
    })

    const page = await browser.newPage()
    // Set a standard viewport size for the screenshot (e.g., for social media cards)
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })

    // Navigate to the target URL and wait until the network is idle
    // This helps ensure all content (including dynamic data) is loaded.
    await page.goto(targetUrl, { waitUntil: "networkidle0" })

    // Take a screenshot of the specified clip area
    const screenshotBuffer = await page.screenshot({
      type: "png",
      fullPage: false, // Capture only the defined viewport/clip area
      clip: {
        x: 0,
        y: 0,
        width: 1200,
        height: 630,
      },
    })

    // Set appropriate headers for image response and caching
    const headers = new Headers()
    headers.set("Content-Type", "image/png")
    // Cache the image for 1 hour (3600 seconds) at the CDN and browser
    headers.set("Cache-Control", "public, max-age=3600, must-revalidate")

    return new NextResponse(screenshotBuffer, { status: 200, headers })
  } catch (error: any) {
    console.error("Error generating screenshot:", error)
    // Return a plain text error message if screenshot generation fails
    return new NextResponse(`Failed to generate screenshot: ${error.message}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    })
  } finally {
    // Ensure the browser is closed even if an error occurs
    if (browser) {
      await browser.close()
    }
  }
}
