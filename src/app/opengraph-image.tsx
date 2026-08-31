import { ImageResponse } from "next/og";

export const alt = "Midwest Pixel Fest — Gaming, Cosplay, Collectibles, Community";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#07060d",
          color: "#f6f1e8",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 28, height: 28, background: "#ff2d95" }} />
          <div style={{ width: 28, height: 28, background: "#2de2ff" }} />
          <div style={{ width: 28, height: 28, background: "#ffd84d" }} />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#2de2ff",
          }}
        >
          Emporia, Kansas · 2027
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 86,
            fontWeight: 700,
            lineHeight: 0.9,
            textTransform: "uppercase",
            marginTop: 16,
          }}
        >
          <div style={{ display: "flex" }}>Midwest</div>
          <div style={{ display: "flex" }}>Pixel Fest</div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 28,
            color: "#ff2d95",
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
        >
          Gaming · Cosplay · Collectibles · Community
        </div>
      </div>
    ),
    { ...size },
  );
}
