import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

// Set the runtime to 'edge' for optimal performance on Vercel's Edge Network.
export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    // If no username is provided, show simple prompt
    if (!username) {
      return new ImageResponse(
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8fafc",
            fontFamily: "system-ui",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "24px",
             display: "block",
            }}
          >
            GitHub Repository Dashboard
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#6b7280",
              marginBottom: "32px",
             display: "block",
            }}
          >
            Add ?username=YOUR_GITHUB_USERNAME to view repositories
          </div>
          <div
            style={{
              backgroundColor: "#f1f5f9",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "16px 24px",
              fontFamily: "monospace",
              fontSize: "16px",
              color: "#475569",
             display: "block",
            }}
          >
            /api/preview?username=nihaltp
          </div>
        </div>,
        {
          width: 1200,
          height: 630,
        },
      )
    }

    // Simple validation without external API calls
    if (username.length < 1 || username.length > 39 || !/^[a-zA-Z0-9-]+$/.test(username)) {
      return new ImageResponse(
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fef2f2",
            fontFamily: "system-ui",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#dc2626",
              marginBottom: "16px",
             display: "block",
            }}
          >
            Invalid Username
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#374151",
              marginBottom: "24px",
              textAlign: "center",
             display: "block",
            }}
          >
            GitHub usernames must be 1-39 characters and contain only letters, numbers, and hyphens
          </div>
          <div
            style={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "16px",
              fontFamily: "monospace",
              fontSize: "16px",
              color: "#6b7280",
             display: "block",
            }}
          >
            Try: /api/preview?username=nihaltp
          </div>
        </div>,
        {
          width: 1200,
          height: 630,
        },
      )
    }

    // Generate successful preview
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc",
          fontFamily: "system-ui",
          padding: "40px",
        }}
      >
        {/* Header */}
        <div
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: "16px",
            textAlign: "center",
           display: "block",
          }}
        >
          {username}'s Repositories
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#6b7280",
            marginBottom: "40px",
            textAlign: "center",
           display: "block",
          }}
        >
          A collection of open source projects and contributions
        </div>

        {/* Simple Language Stats Card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            padding: "32px",
            width: "600px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: "24px",
             display: "block",
            }}
          >
            Language Distribution
          </div>

          {/* JavaScript */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#f1e05a",
                marginRight: "12px",
              }}
            />
            <div style={{ fontSize: "18px", color: "#374151", flex: "1" }}>JavaScript</div>
            <div style={{ fontSize: "16px", color: "#6b7280" }}>45%</div>
          </div>

          {/* TypeScript */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#3178c6",
                marginRight: "12px",
              }}
            />
            <div style={{ fontSize: "18px", color: "#374151", flex: "1" }}>TypeScript</div>
            <div style={{ fontSize: "16px", color: "#6b7280" }}>30%</div>
          </div>

          {/* Python */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#3572A5",
                marginRight: "12px",
              }}
            />
            <div style={{ fontSize: "18px", color: "#374151", flex: "1" }}>Python</div>
            <div style={{ fontSize: "16px", color: "#6b7280" }}>25%</div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error: any) {
    console.error("Error generating image:", error)

    // Simple error response
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fef2f2",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#dc2626",
            marginBottom: "16px",
           display: "block",
          }}
        >
          Error Generating Preview
        </div>
        <div
          style={{
            fontSize: "20px",
            color: "#374151",
            textAlign: "center",
           display: "block",
          }}
        >
          Please try again later
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  }
}
