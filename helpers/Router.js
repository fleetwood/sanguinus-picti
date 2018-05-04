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

    /**
     * References to pug view locations
     */
    get views() {
        return {
            base: 'layouts/base',
            error: 'layouts/error',
            home: 'layouts/home',
            left: 'layouts/left',
            right: 'layouts/right'
        };
    };

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
        this.router.get(url, function (req, res, next) {
            callback(req, res, next);
        });
    }
    
    post(url, callback) {
        this.router.post(url, function (req, res, next) {
            callback(req, res, next);
        });
    }

    get page_error() {
        return { content: `There was an error loading the page.` };
    }

    page_error(err) {
        return { content: `There was an error loading the page: ${err ? err.message : 'Unknown error'}` };
    }

    renderError(res, err) {
        res.render(this.views.error, { error: err });
    }
}

module.exports = new Router();
