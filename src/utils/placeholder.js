export function placeholderImage({
  width = 1600,
  height = 1000,
  title = "YOUR PROJECT",
  sub = "REPLACE THIS MEDIA",
  accent = "#ff3c20",
} = {}) {
  const safeTitle = String(title).replace(/[<>&]/g, "");
  const safeSub = String(sub).replace(/[<>&]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#0a0a0b"/><circle cx="${width * 0.72}" cy="${height * 0.32}" r="${Math.min(width, height) * 0.24}" fill="${accent}" opacity=".72"/><path d="M0 ${height * 0.75} L${width} ${height * 0.25}" stroke="#fff" stroke-opacity=".22" stroke-width="2"/><text x="8%" y="76%" fill="#fff" font-family="Arial,sans-serif" font-size="${Math.round(width * 0.06)}" font-weight="700">${safeTitle}</text><text x="8%" y="84%" fill="#aaa" font-family="monospace" font-size="${Math.round(width * 0.018)}">${safeSub}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
