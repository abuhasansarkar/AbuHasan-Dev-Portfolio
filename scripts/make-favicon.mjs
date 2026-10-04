/**
 * One-off generator for the photo favicon.
 * Reads public/abuhasan.jpg and writes src/app/icon.png + src/app/apple-icon.png.
 */
import sharp from "sharp";

const SRC = "public/abuhasan.jpg";
const OUT_ICON = "src/app/icon.png";
const OUT_APPLE = "src/app/apple-icon.png";

/** Square window centred on the face (source is 826x934): full hair + beard, cut just under the chin. */
const CROP = { left: 155, top: 85, width: 520, height: 520 };

/** Matches the site accent (`--accent: 22 100% 58%` in dark) and the near-black page background. */
const ACCENT = "#ff7c29";
const INK = "#0a0a0c";

const face = (size) => sharp(SRC).rotate().extract(CROP).resize(size, size, { fit: "cover" });

/** Clip to a circle so the photo reads as a portrait avatar at 16px. */
const circleMask = Buffer.from(
  `<svg width="512" height="512"><circle cx="256" cy="256" r="244" fill="#fff"/></svg>`,
);
/** Dark keyline + accent ring: keeps the icon legible on both light and dark browser chrome. */
const rings = Buffer.from(
  `<svg width="512" height="512">
     <circle cx="256" cy="256" r="248" fill="none" stroke="${INK}" stroke-width="14"/>
     <circle cx="256" cy="256" r="239" fill="none" stroke="${ACCENT}" stroke-width="5"/>
   </svg>`,
);

const masked = await face(512).composite([{ input: circleMask, blend: "dest-in" }]).png().toBuffer();
await sharp(masked)
  .composite([{ input: rings }])
  /* Palette-quantised: keeps a photo favicon ~4x smaller than full-colour PNG. */
  .png({ compressionLevel: 9, palette: true, quality: 92 })
  .toFile(OUT_ICON);

/** iOS applies its own squircle mask, so this one ships full-bleed with soft corners. */
const appleMask = Buffer.from(
  `<svg width="180" height="180"><rect width="180" height="180" rx="42" fill="#fff"/></svg>`,
);
await face(180)
  .composite([{ input: appleMask, blend: "dest-in" }])
  .png({ compressionLevel: 9, palette: true, quality: 92 })
  .toFile(OUT_APPLE);

const meta = await sharp(OUT_ICON).metadata();
console.log(`wrote ${OUT_ICON} (${meta.width}x${meta.height}) and ${OUT_APPLE}`);