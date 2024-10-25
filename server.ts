import http from 'node:http';
import { bodyParser } from './core/bodyParser';
import { Database } from './core/Database';

const db = new Database();

const server = http.createServer(async (request, response) => {
  const body = await bodyParser(request);

  response.setHeader("Content-Type", "Application/json");
  
  if (request.method === "POST" && request.url === "/") {
    await db.insert("testing", body);
    response.statusCode = 201;
    return response.end("Created");
  }

  response.end("Hello World");
});

const port = 8080;
const hostname = "localhost"

server.listen(port, hostname, () => {
  console.log(`Server is Running at: http://${hostname}:${port}`)
})
