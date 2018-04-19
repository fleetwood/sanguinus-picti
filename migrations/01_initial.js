exports.up = function (knex, Promise) {
    return Promise.all([

        knex.schema.createTable('users', function(table) {
            table.increments('id').primary();
            table.string('username');
            table.string('password');
            table.string('name');
            table.string('email');
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
            table.boolean('featured');
            table.integer('author_id')
                 .references('id')
                 .inTable('users');
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
