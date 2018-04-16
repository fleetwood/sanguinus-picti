exports.up = function (knex, Promise) {
    return Promise.all([

        knex.schema.createTable('users', function(table) {
            table.increments('uid').primary();
            table.string('username');
            table.string('password');
            table.string('name');
            table.string('email');
            table.timestamps();
        }),

        knex.schema.createTable('tattoos', function(table){
            table.increments('id').primary();
            table.string('title');
            table.string('body');
            table.boolean('featured');
            table.integer('author_id')
                 .references('uid')
                 .inTable('users');
            table.dateTime('postDate');
        }),

        knex.schema.createTable('tattoo_images', function(table){
            table.increments('id').primary();
            table.string('description');
            table.integer('author_id')
                 .references('uid')
                 .inTable('users');
            table.integer('tattoo_id')
                 .references('id')
                 .inTable('tattoos');
            table.dateTime('postDate');
        }),

        knex.schema.createTable('pages', function(table){
            table.increments('id').primary();
            table.string('url');
            table.string('layout');
            table.string('title');
            table.string('body');
            table.string('header_image');
            table.boolean('featured');
            table.integer('author_id')
                 .references('uid')
                 .inTable('users');
            table.dateTime('postDate');
        })
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('users'),
        knex.schema.dropTable('tattoos'),
        knex.schema.dropTable('tattoo_images'),
        knex.schema.dropTable('pages')
    ])
};
