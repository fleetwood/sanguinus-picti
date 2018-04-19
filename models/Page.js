const KnexModel = require('../helpers/KnexModel');

const definition = {
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

class Page extends KnexModel {
    constructor(type) {
        super(definition);
        this._pageType = type;
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
}

module.exports = Page;
