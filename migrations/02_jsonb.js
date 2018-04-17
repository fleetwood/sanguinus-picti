exports.up = function (knex, Promise) {
    return Promise.all([

        knex.schema.table('pages', function (table) {
            table.jsonb('images');
          }),

        knex.schema.table('tattoos', function (table) {
            table.jsonb('images');
        })
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        
        knex.schema.table('pages', function (table) {
            table.dropColumn('images');
          }),

        knex.schema.table('tattoos', function (table) {
            table.dropColumn('images');
        })
    ])
};
