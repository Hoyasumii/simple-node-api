import http from 'node:http';

const server = http.createServer((request, response) => {
  response.end("Hello World");
});

const port = 8080;
const hostname = "localhost"

server.listen(port, hostname, () => {
  console.log(`Server is Running at: http://${hostname}:${port}`)
})
