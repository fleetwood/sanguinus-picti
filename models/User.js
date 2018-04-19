const KnexModel = require('../helpers/KnexModel');

const definition = {
    tableName: 'users',
    key: 'id',
    fields: {
        properties: {
            username: {
                type: 'string',
                trim: true,
                required: true
            },
            password: {
                type: 'string',
                trim: true,
                required: true
            },
            name: {
                type: 'string',
                trim: true,
                required: true
            },
            email: {
                type: 'string',
                trim: true,
                required: true
            }
        }
    }
};

module.exports = new KnexModel(definition);
