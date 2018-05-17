const KnexModel = require('../helpers/KnexModel');

class Page extends KnexModel {
    constructor(title = "Not set", type = "Not provided") {
        super(Page.definition);
        this._title = title;
        this._pageType = type;
        this._user = this._user || null;
    }

    static get definition() {
        return {
            tableName: 'pages',
            key: 'id',
            fields: {
                properties: {
                    url: {
                        type: 'string',
                        trim: true,
                        required: true
                    },
                    pageType: {
                        type: 'string',
                        trim: true,
                        required: true
                    },
                    title: {
                        type: 'string',
                        trim: true,
                        required: true
                    },
                    body: {
                        type: 'string',
                        trim: true,
                        required: true
                    },
                    summary: {
                        type: 'string',
                        trim: true,
                        required: true
                    },
                    images: {
                        type: 'json',
                        trim: true,
                        required: true
                    },
                    featured: {
                        type: 'boolean'
                    },
                    author_id: {
                        type: 'integer',
                        required: true
                    },
                    postDate: {
                        type: 'datetime',
                        required: true
                    }
                }
            }
        };
    }

    get title() {
        return this._title;
    }
    get pageType() {
        return this._pageType;
    }

    get pageTypes() {
        return KnexModel.pageTypes;
    }

    get tables() {
        return KnexModel.tables;
    }

    get user() {
        return this._user;
    }
    
    parseData(pageData) {
        return {
            title: this.title,
            current: this.pageType,
            user: this.user,
            menus,
            data
        };
    };

    viewData(user, menus, data) {
        return {
            title: this.title,
            current: this.pageType,
            user: this.user,
            menus: menus.menus || menus,
            data
        };
    };

    getPageData(req) {
        return new Promise((resolve, reject) => {
            this.pageData(req.params.url)
                .then((results) => {
                    const data = {
                        title: this.title,
                        current: this.pageType,
                        user: this.user,
                        menus: {
                            featuredblogs: results.featuredBlogs.featuredblogs,
                            featuredtattoos: results.featuredTattoos.featuredtattoos
                        },
                        data: results
                    };
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}

module.exports = Page;
