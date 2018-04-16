const KnexModel = require('../helpers/KnexModel');

const definition = {
    tableName: 'pages',
    fields: {
        properties: {
            url: {
                type: 'string',
                trim: true,
                required: true
            },
            layout: {
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
            header_image: {
                type: 'string',
                trim: true,
                required: false
            },
            featured: {
                type: 'boolean'
            },
            author_id: {
                type: 'integer',
                required: true
            }
        }
    }
};

class Page extends KnexModel {

    getBlogUrl(blogurl, done) {
        return this.getWhere({url: blogurl}, done);
    }
}

module.exports = new Page(definition);
