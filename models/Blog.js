const Page = require('./Page');

class Blog extends Page {
    constructor() {
        super('Blog', Page.pageTypes.blog);
    }
}

module.exports = new Blog();
