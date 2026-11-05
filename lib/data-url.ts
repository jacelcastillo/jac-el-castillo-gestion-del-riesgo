/** Decodes a base64 data URL without fetch, which the CSP connect-src blocks for data: URLs. */
export function dataUrlToBlob(dataUrl: string): Blob {
  const comma = dataUrl.indexOf(',')
  const mime = /^data:([^;,]+)/.exec(dataUrl.slice(0, comma))?.[1] ?? 'application/octet-stream'
  const binary = atob(dataUrl.slice(comma + 1))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}
