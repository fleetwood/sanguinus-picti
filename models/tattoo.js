const Page = require('./Page');

class Tattoo extends Page {
    constructor() {
        super('Tattoos', Page.pageTypes.tattoos);
    }
}

module.exports = new Tattoo();
