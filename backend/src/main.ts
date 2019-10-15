import * as express from 'express'

const server = express();
server.use(express.static("web"));

server.listen(8080, () => {
    console.log("Running server...")
});
