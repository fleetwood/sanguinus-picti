const config = require('../config/config');
const knex = require('../database/knex');
const express = require('express');
const router = express.Router();

class Router {
    constructor() {
        this._config = config;
        this._knex = knex;
        this._express = express;
        this._router = router;
    }

    get config() {
        return this._config;
    }

    get knex() {
        return this._knex;
    }

    get express() {
        return this._express;
    }

    get router() {
        return this._router;
    }

    get(url, callback) {
        this._router.get(url, function(req, res, next) {
            callback(res);
        });
    }
}

module.exports = new Router();
