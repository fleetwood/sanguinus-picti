const Page = require('./Page');

class Blog extends Page {
    constructor() {
        super(Page.pageTypes.blog);
    }
}

module.exports = new Blog();
