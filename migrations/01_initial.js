exports.up = function (knex, Promise) {
    return Promise.all([

        knex.schema.createTable('users', function(table) {
            table.increments('id').primary();
            table.string('firstname');
            table.string('lastname');
            table.string('image');
            table.string('auth0');
            table.timestamps();
        }),

        knex.schema.createTable('pages', function(table){
            table.increments('id').primary();
            table.string('url');
            table.string('pageType');
            table.string('title');
            table.string('body');
            table.string('summary');
            table.jsonb('images');
            table.specificType('authors', 'int[]');
            table.boolean('featured');
            table.dateTime('postDate');
            table.timestamps();
        })
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('users'),
        knex.schema.dropTable('pages')
    ])
};
