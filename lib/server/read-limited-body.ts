/** Lee el cuerpo y corta en cuanto pasa el límite, sin confiar en Content-Length. */
export async function readLimitedBody(request: Request, maxBytes: number): Promise<Uint8Array | null> {
  const declared = Number(request.headers.get('content-length'))
  if (declared > maxBytes) return null
  if (!request.body) return new Uint8Array()

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let received = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    received += value.byteLength
    if (received > maxBytes) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }
  return Buffer.concat(chunks)
}
