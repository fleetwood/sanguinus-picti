const Router = require('../helpers/Router')
const blogs = require('../models/Blog');
const tattoos = require('../models/Tattoo');

class ViewPage {
    constructor(model = null) {
        this._model = model;
        this._router = new Router();
        this.blogs = blogs;
        this.tattoo = tattoos;
    }

    get model() {
        return this._model;
    }

    get router() {
        return this._router;
    }

    /**
   * Get 10 most recent blogs
   * @param {function} done 
   */
    recentBlogList(done) {
        return blogs.all({
            from: this.blogs.dbviews.page_author,
            orderCol: 'postDate',
            orderDir: 'desc',
            limit: 10
        },
            done);
    }

    /**
    * Get all featured blogs
    * @param {function} done 
    */
    featuredBlogList(done) {
        return this.blogs.all({
            from: this.blogs.dbviews.page_author,
            where: { featured: true },
            orderCol: 'postDate',
            orderDir: 'desc'
        },
            done);
    }

    /**
    * Get all featured tattoos
    * @param {function} done 
    */
    featuredTattooList(done) {
        return this.tattoos.all({
            from: this.tattoos.dbviews.tattoo_author,
            where: { featured: true },
            orderCol: 'postDate',
            orderDir: 'desc'
        },
            done);
    }
}

module.exports = ViewPage;
