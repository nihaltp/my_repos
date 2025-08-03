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
          backgroundColor: "#f8fafc", // Mimics slate-50
          backgroundImage: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)", // Mimics from-slate-50 to-slate-100
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            width: "100%",
            maxWidth: "1000px",
          }}
        >
          {/* Placeholder for Search and Filter */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              width: "100%",
              height: "40px",
              backgroundColor: "#cbd5e1", // Mimics slate-300
              borderRadius: "8px",
            }}
          />

          {/* Placeholder for Language Stats */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              width: "100%",
              padding: "24px",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e2e8f0", // Mimics slate-200
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: "semibold", color: "#0f172a" }}>Language Distribution</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "9999px", backgroundColor: "#f1e05a" }} />
                <span style={{ fontSize: "16px", fontWeight: "medium" }}>JavaScript</span>
              </div>
              <div style={{ width: "200px", height: "8px", backgroundColor: "#cbd5e1", borderRadius: "9999px" }} />
              <span style={{ fontSize: "14px", color: "#64748b" }}>45.0%</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "9999px", backgroundColor: "#3178c6" }} />
                <span style={{ fontSize: "16px", fontWeight: "medium" }}>TypeScript</span>
              </div>
              <div style={{ width: "150px", height: "8px", backgroundColor: "#cbd5e1", borderRadius: "9999px" }} />
              <span style={{ fontSize: "14px", color: "#64748b" }}>30.0%</span>
            </div>
          </div>

          {/* Placeholder for Repository Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              width: "100%",
            }}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "200px",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  padding: "24px",
                  gap: "16px",
                }}
              >
                <div style={{ height: "24px", width: "80%", backgroundColor: "#cbd5e1", borderRadius: "4px" }} />
                <div style={{ height: "16px", width: "90%", backgroundColor: "#e2e8f0", borderRadius: "4px" }} />
                <div style={{ height: "16px", width: "70%", backgroundColor: "#e2e8f0", borderRadius: "4px" }} />
                <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                  <div style={{ height: "32px", width: "50%", backgroundColor: "#cbd5e1", borderRadius: "8px" }} />
                  <div style={{ height: "32px", width: "50%", backgroundColor: "#cbd5e1", borderRadius: "8px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>,
      {
        // Image dimensions for Open Graph standard (1200x630 is common)
        width: 1200,
        height: 630,
        headers: {
          "Content-Type": "image/png",
          // Cache the image for a long time as it's immutable for a given username
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
