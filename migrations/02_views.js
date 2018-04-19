exports.up = function (knex, Promise) {
    return Promise.all([

        knex.schema.raw(`
        CREATE OR REPLACE VIEW public.page_author AS 
            SELECT pages.id,
                pages.url,
                pages.pageType,
                pages.title,
                pages.body,
                pages.summary,
                pages.images,
                pages.featured,
                pages.author_id,
                pages."postDate",
                users.username,
                users.name
            FROM pages
                JOIN users ON pages.author_id = users.id;

--            ALTER TABLE public.page_author
--            OWNER TO develop;
        `)
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.raw('DROP ')
    ])
};
