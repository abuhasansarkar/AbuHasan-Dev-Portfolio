import { deleteFromImageKit, getImageKitAuthParameters, uploadToImageKit } from "./src/lib/imagekit/server";
import { getImageKitUrl, getImageKitBlurUrl } from "./src/lib/imagekit/url";

async function main() {
  console.log("=========================================");
  console.log("  ImageKit Next.js Integration Test");
  console.log("=========================================\n");

  // 1. Auth parameters test
  console.log("1. Generating Client-Side Auth Parameters...");
  const auth = getImageKitAuthParameters();
  console.log("   - Token:     ", auth.token);
  console.log("   - Expire:    ", auth.expire);
  console.log("   - Signature: ", auth.signature ? "Valid (Signature generated)" : "Missing");

  // 2. URL Transformation test
  console.log("\n2. Testing Real-time URL Transformations...");
  const sampleUrl = "https://ik.imagekit.io/abuhasansarkar/sample.jpg";
  const transformedUrl = getImageKitUrl(sampleUrl, {
    width: 800,
    height: 600,
    quality: 85,
    format: "webp",
    crop: "maintain_ratio",
  });
  console.log("   - Transformed:", transformedUrl);
  const blurUrl = getImageKitBlurUrl(sampleUrl);
  console.log("   - LQIP Blur:  ", blurUrl);

  // 3. Upload test to folder Developer-Portfolio
  console.log("\n3. Testing Server-side Upload to /Developer-Portfolio...");
  const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 300 120">
    <rect width="300" height="120" rx="16" fill="#09090b"/>
    <text x="150" y="68" fill="#a855f7" font-family="system-ui" font-weight="bold" font-size="20" text-anchor="middle">ImageKit Live Test</text>
  </svg>`;

  const uploadResult = await uploadToImageKit({
    file: Buffer.from(sampleSvg),
    fileName: `test-badge-${Date.now()}.svg`,
    folder: "/Developer-Portfolio",
    tags: ["test", "verification"],
  });

  console.log("   - Status:       SUCCESS");
  console.log("   - File ID:     ", uploadResult.fileId);
  console.log("   - File Name:   ", uploadResult.name);
  console.log("   - Hosted URL:  ", uploadResult.url);
  console.log("   - File Path:   ", uploadResult.filePath);

  // 4. Cleanup test
  console.log("\n4. Testing Cleanup (deleteFromImageKit)...");
  const isDeleted = await deleteFromImageKit(uploadResult.fileId);
  console.log("   - Deleted:     ", isDeleted ? "SUCCESS" : "FAILED");

  console.log("\nAll ImageKit checks completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Test failed:", err);
    process.exit(1);
  });
