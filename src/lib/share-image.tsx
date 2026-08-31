import { ImageResponse } from "next/og";

export const shareImageAlt =
  "Midwest Pixel Fest — October 16–17, 2027 — Emporia, Kansas — Gaming, Cosplay, Collectibles, Community";
export const shareImageSize = { width: 1200, height: 630 };
export const shareImageContentType = "image/png";

/**
 * Share cards stay generated artwork. The full JPG logo is too detailed
 * (and too large) to rasterize reliably inside ImageResponse, and it would
 * also be unreadable if used as the entire 1200×630 card.
 */
export function generateShareImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07060d",
          color: "#f6f1e8",
          padding: 56,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            border: "4px solid #ff2d95",
            padding: 48,
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 28, height: 28, background: "#ff2d95" }} />
              <div style={{ width: 28, height: 28, background: "#2de2ff" }} />
              <div style={{ width: 28, height: 28, background: "#ffd84d" }} />
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 22,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: "#ffd84d",
              }}
            >
              OCT 16–17, 2027
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 24,
                letterSpacing: 8,
                textTransform: "uppercase",
                color: "#2de2ff",
              }}
            >
              Emporia, Kansas
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 84,
                fontWeight: 700,
                lineHeight: 0.9,
                textTransform: "uppercase",
                marginTop: 12,
              }}
            >
              <div style={{ display: "flex" }}>Midwest</div>
              <div style={{ display: "flex", color: "#ff2d95" }}>Pixel Fest</div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#2de2ff",
              textTransform: "uppercase",
              letterSpacing: 4,
            }}
          >
            Gaming • Cosplay • Collectibles • Community
          </div>
        </div>
      </div>
    ),
    { ...shareImageSize },
  );
}
