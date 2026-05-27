import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "assets", "secure_vault_logo_1779581755129-C9e_6vdN.png");
const publicAssets = path.join(root, "public", "assets");
const sizes = [48, 96, 192, 512];

await fs.mkdir(publicAssets, { recursive: true });

const original = await sharp(source).metadata();

for (const size of sizes) {
  await sharp(source)
    .resize(size, size, { fit: "contain" })
    .webp({ quality: size <= 96 ? 82 : 80 })
    .toFile(path.join(publicAssets, `securevault-icon-${size}.webp`));
}

await sharp(source)
  .resize(48, 48, { fit: "contain" })
  .png({ compressionLevel: 9, palette: true })
  .toFile(path.join(publicAssets, "securevault-icon-48.png"));

await sharp(source)
  .resize(512, 512, { fit: "contain" })
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicAssets, "securevault-og-512.png"));

const outputs = await Promise.all(
  [
    "securevault-icon-48.webp",
    "securevault-icon-96.webp",
    "securevault-icon-192.webp",
    "securevault-icon-512.webp",
    "securevault-icon-48.png",
    "securevault-og-512.png",
  ].map(async (file) => {
    const stat = await fs.stat(path.join(publicAssets, file));
    return `${file}: ${stat.size} bytes`;
  })
);

console.log(`Original: ${original.width}x${original.height}`);
console.log(outputs.join("\n"));
