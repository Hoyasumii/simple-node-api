import http from "node:http";

export async function bodyParser(request: http.IncomingMessage) {
  const bodyBuffers: Array<Uint8Array> = [];

  for await (const chunk of request) {
    bodyBuffers.push(chunk);
  }

  return bodyBuffers.length > 0
    ? JSON.parse(Buffer.concat(bodyBuffers).toString("utf8"))
    : undefined;
}
