import { ImageResponse } from "next/og";

export const alt = "Veloria — Structure. Strength. Readiness.";
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
          justifyContent: "space-between",
          background: "#0b1f1a",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 18,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#c4a574",
          }}
        >
          Veloria
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 88,
              lineHeight: 1.05,
              color: "#f3efe7",
              letterSpacing: "-0.03em",
            }}
          >
            Build before you raise.
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              color: "#c4a574",
            }}
          >
            Structure. Strength. Readiness.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
