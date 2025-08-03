import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

// Set the runtime to 'edge' for optimal performance on Vercel's Edge Network.
export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    // Extract the username from the URL's search parameters.
    // If no username is provided, a default placeholder will be used.
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username") || "your-github-username"

    const titleText = username === "your-github-username" ? "My Repositories" : `${username}'s Repositories`
    const descriptionText = "A collection of open source projects and contributions."

    return new ImageResponse(
      // This JSX will be rendered into the PNG image.
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc", // Simplified to a solid light background
          color: "#0f172a", // Mimics slate-900
          fontFamily: "sans-serif",
          padding: "40px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              marginBottom: "16px",
              color: "#0f172a",
            }}
          >
            {titleText}
          </h1>
          <p
            style={{
              fontSize: "24px",
              color: "#475569", // Mimics slate-600
              maxWidth: "800px",
              lineHeight: "1.5",
            }}
          >
            {descriptionText}
          </p>
          {username === "your-github-username" && (
            <p
              style={{
                fontSize: "18px",
                color: "#64748b", // Mimics slate-500
                marginTop: "16px",
              }}
            >
              To view your own, add `?username=YOUR_GITHUB_USERNAME` to the URL.
            </p>
          )}
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, immutable, no-transform, max-age=31536000", // Cache for 1 year
        },
      },
    )
  } catch (error: any) {
    console.error("Error generating image:", error)
    // Return an error image if generation fails
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fee2e2", // Mimics red-100
          color: "#dc2626", // Mimics red-600
          fontFamily: "sans-serif",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "16px" }}>Error Generating Preview</h1>
        <p style={{ fontSize: "24px", maxWidth: "800px" }}>There was an issue generating the image preview.</p>
        <p style={{ fontSize: "18px", marginTop: "16px" }}>{error.message || "Unknown error."}</p>
      </div>,
      {
        width: 1200,
        height: 630,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-cache, no-store, must-revalidate", // Do not cache error images
        },
        status: 500, // Indicate a server error
      },
    )
  }
}
