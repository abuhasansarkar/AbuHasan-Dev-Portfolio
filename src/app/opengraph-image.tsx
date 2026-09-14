import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.shortTitle;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          backgroundColor: "#0a0a0c",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #1a1a24 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a1a24 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#18181b",
              border: "1px solid #27272a",
              color: "#f59e0b",
              fontSize: "24px",
              fontWeight: 800,
            }}
          >
            AH
          </div>
          <span style={{ fontSize: "22px", color: "#a1a1aa", fontWeight: 600 }}>
            AbuHasan · Portfolio
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "54px",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              color: "#ffffff",
            }}
          >
            Full-Stack Web Developer &amp; WordPress Specialist
          </div>
          <div style={{ fontSize: "24px", color: "#9ca3af", maxWidth: "900px", lineHeight: 1.4 }}>
            Crafting high-converting, lightning-fast digital experiences with Next.js, React, and WordPress.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            {["Next.js", "React", "WordPress", "WooCommerce", "UI/UX"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  background: "#18181b",
                  border: "1px solid #27272a",
                  color: "#e4e4e7",
                  fontSize: "16px",
                  fontWeight: 500,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "18px", color: "#10b981", fontWeight: 600 }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} />
            <span>Available for new projects</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
