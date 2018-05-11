const Page = require('./Page');

class Tattoo extends Page {
    constructor(user) {
        super('Tattoos', Page.pageTypes.tattoos);
        this._user = this._user || user || null;
    }
}

module.exports = Tattoo;
