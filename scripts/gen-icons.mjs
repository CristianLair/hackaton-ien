import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public");

const TEAL = [13, 148, 136];
const WHITE = [255, 255, 255];

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

function encodePNG(size, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const rowLen = size * 4 + 1;
  const raw = Buffer.alloc(size * rowLen);
  for (let y = 0; y < size; y++) {
    raw[y * rowLen] = 0;
    for (let x = 0; x < size; x++) {
      const src = (y * size + x) * 4;
      const dst = y * rowLen + 1 + x * 4;
      for (let c = 0; c < 4; c++) raw[dst + c] = rgba[src + c];
    }
  }
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function drawPackage(size, maskable) {
  const rgba = new Uint8Array(size * size * 4);
  const px = (x, y) => (y * size + x) * 4;

  for (let i = 0; i < size * size; i++) {
    const o = i * 4;
    rgba[o] = TEAL[0];
    rgba[o + 1] = TEAL[1];
    rgba[o + 2] = TEAL[2];
    rgba[o + 3] = 255;
  }

  const s = maskable ? 0.58 : 0.74;
  const cx = 0.5;
  const rel = (v) => Math.round((cx + (v - 0.5) * s) * size);

  const yBand0 = rel(0.4);
  const yBand1 = rel(0.46);
  const yBoxTop = rel(0.46);
  const yBoxBot = rel(0.78);
  const xBandL = rel(0.2);
  const xBandR = rel(0.8);
  const xBoxL = rel(0.27);
  const xBoxR = rel(0.73);
  const xCreaseMin = rel(0.494);
  const xCreaseMax = rel(0.506);

  const fill = (x0, y0, x1, y1, color) => {
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const o = px(x, y);
        rgba[o] = color[0];
        rgba[o + 1] = color[1];
        rgba[o + 2] = color[2];
      }
    }
  };

  fill(xBandL, yBand0, xBandR, yBand1, WHITE);
  fill(xBoxL, yBoxTop, xBoxR, yBoxBot, WHITE);
  fill(xCreaseMin, yBand0, xCreaseMax, yBoxBot, TEAL);

  return Buffer.from(rgba);
}

const targets = [
  ["icon-192.png", 192, false],
  ["icon-512.png", 512, false],
  ["icon-512-maskable.png", 512, true],
  ["apple-touch-icon.png", 180, false],
  ["badge.png", 96, false],
];

mkdirSync(OUT, { recursive: true });
for (const [name, size, maskable] of targets) {
  const buf = encodePNG(size, drawPackage(size, maskable));
  writeFileSync(join(OUT, name), buf);
  console.log(`✓ ${name} (${size}x${size}, ${buf.length} bytes)`);
}