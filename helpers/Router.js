const config = require('../config/config');
const knex = require('../database/knex');
const ensureLogin = require('connect-ensure-login').ensureLoggedIn();
const express = require('express');
const router = express.Router();

class Router {
    constructor() {
        this._config = config;
        this._knex = knex;
        this._express = express;
        this._router = router;
        this._user = null;
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

    get user() {
        return this._user;
    }

    setUser(req, res) {
        //todo: tie the auth0 user to SP. Somehow.
        if (res.locals.loggedIn && this._user === null) {
            this._user = req.session.passport.user;
        }
    }

    restricted(url, callback) {
        this.router.get(url, ensureLogin, (req, res, next) => {
            this.setUser(req, res);
            callback(req, res, next);
        });
    }

    get(url, callback) {
        this.router.get(url, (req, res, next) => {
            this.setUser(req, res);
            callback(req, res, next);
        });
    }
    
    post(url, callback) {
        this.router.post(url, ensureLogin, (req, res, next) => {
            this.setUser(req, res);
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
