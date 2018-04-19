const Page = require('./Page');

class Tattoo extends Page {
    constructor() {
        super(Page.pageTypes.tattoos);
    }
}

module.exports = new Tattoo();
