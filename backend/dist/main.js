"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const server = express();
server.use(express.static("web"));
server.listen(8080, () => {
    console.log("Running server...");
});
//# sourceMappingURL=main.js.map