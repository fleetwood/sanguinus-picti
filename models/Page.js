const KnexModel = require('../helpers/KnexModel');

class Page extends KnexModel {
    constructor(title = "Not set", type = "Not provided") {
        super(Page.definition);
        this._title = title;
        this._pageType = type;
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

    viewData(user, menus, data) {
        return {
            title: this.title,
            current: this.pageType,
            user,
            menus,
            data
        };
    };

    pageData(menus, pageData) {
        return {
            menus: menus,
            id: pageData.id,
            url: pageData.url,
            title: pageData.title,
            summary: pageData.summary,
            body: pageData.body,
            featured: pageData.featured,
            header: pageData.images.header,
            gallery: pageData.images.gallery,
            pageType: pageData.pageType,
            isBlog: pageData.pageType === Page.pageTypes.blog,
            isTattoo: pageData.pageType === Page.pageTypes.tattoos
        };
    };
}

module.exports = Page;
