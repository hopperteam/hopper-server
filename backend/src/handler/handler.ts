import * as express from 'express';

export default class Handler {
    protected router: express.Router;

    constructor() {
        this.router = express.Router();
    }

    getRouter(): express.Router {
        return this.router;
    }
}
