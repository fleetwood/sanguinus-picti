const views = {
    all_pages: `
        -- DROP VIEW public.all_pages;

        CREATE OR REPLACE VIEW public.all_pages AS 
        SELECT p.id,
            p.url,
            p."pageType",
            p.title,
            p.body,
            p.summary,
            p.images,
            p.featured,
            p."postDate",
            json_agg(json_build_object('id', u.id, 'firstname', u.firstname, 'lastname', u.lastname, 'image', u.image, 'auth0', u.auth0)) AS authors
        FROM pages p
            JOIN users u ON u.id = ANY (p.authors)
        GROUP BY p.id;

        ALTER TABLE public.all_pages
        OWNER TO develop;
    `,
    blogs: `
        -- DROP VIEW public.blogs;

        CREATE OR REPLACE VIEW public.blogs AS 
        SELECT p.id,
            p.url,
            p."pageType",
            p.title,
            p.body,
            p.summary,
            p.images,
            p.featured,
            p."postDate",
            p.authors
        FROM all_pages p
        WHERE p."pageType"::text = 'blog'::text
        ORDER BY p."postDate" DESC;

        ALTER TABLE public.blogs
        OWNER TO postgres;
    `,
    tattoos: `
        -- DROP VIEW public.tattoos;

        CREATE OR REPLACE VIEW public.tattoos AS 
        SELECT p.id,
            p.url,
            p."pageType",
            p.title,
            p.body,
            p.summary,
            p.images,
            p.featured,
            p."postDate",
            p.authors
        FROM all_pages p
        WHERE p."pageType"::text = 'tattoos'::text
        ORDER BY p."postDate" DESC;

        ALTER TABLE public.tattoos
        OWNER TO postgres;
        `,
    menus:`
        -- View: public.menus

        -- DROP VIEW public.menus;
        
        CREATE OR REPLACE VIEW public.menus AS 
        SELECT json_agg(json_build_object('id', b.id, 'url', b.url, 'pageType', b."pageType", 'title', b.title, 'body', b.body, 'summary', b.summary, 'images', b.images, 'featured', b.featured, 'postDate', b."postDate", 'authors', b.authors)) AS featuredblogs,
            json_agg(json_build_object('id', t.id, 'url', t.url, 'pageType', t."pageType", 'title', t.title, 'body', t.body, 'summary', t.summary, 'images', t.images, 'featured', t.featured, 'postDate', t."postDate", 'authors', t.authors)) AS featuredtattoos
        FROM blogs b
            JOIN tattoos t ON t.featured = true;
        
        ALTER TABLE public.menus
        OWNER TO develop;
    `,
    cf_tats: `
        -- DROP VIEW public.cf_tats;

        CREATE OR REPLACE VIEW public.cf_tats AS 
        SELECT t.id,
            t.url,
            t."pageType",
            t.title,
            t.body,
            t.summary,
            t.images,
            t.featured,
            t.authors,
            t."postDate"
        FROM tattoos t,
            LATERAL json_array_elements(t.authors) author(value)
        WHERE (author.value ->> 'firstname'::text) = 'Christina'::text
        ORDER BY t."postDate" DESC;

        ALTER TABLE public.cf_tats
        OWNER TO postgres;
    `,
    jf_tats: `
        -- DROP VIEW public.jf_tats;

        CREATE OR REPLACE VIEW public.jf_tats AS 
        SELECT t.id,
            t.url,
            t."pageType",
            t.title,
            t.body,
            t.summary,
            t.images,
            t.featured,
            t.authors,
            t."postDate"
        FROM tattoos t,
            LATERAL json_array_elements(t.authors) author(value)
        WHERE (author.value ->> 'firstname'::text) = 'John'::text
        ORDER BY t."postDate" DESC;

        ALTER TABLE public.jf_tats
        OWNER TO postgres;
    `
};

const functions = {
    pagedata: `
    -- DROP FUNCTION public.pageurl(pageurl text);
    
    CREATE OR REPLACE FUNCTION public.pagedata(pageurl text) RETURNS json AS $$
            DECLARE result json;
            BEGIN
                WITH b AS (
                SELECT * 
                FROM blogs
                WHERE featured = true
                ), t AS (
                SELECT * 
                FROM tattoos
                WHERE featured = true
                )
    
                SELECT json_build_object(
                    'id', p.id,
                    'url', p.url,
                    'pageType', p."pageType",
                    'title', p.title,
                    'body', p.body,
                    'summary', p.summary,
                    'images', p.images,
                    'featured', p.featured,
                    'authors', p.authors,
                    'postDate', p."postDate",
                    'featuredBlogs', b.*,
                    'featuredTattoos', t.*
                )
                FROM all_pages p
                    LEFT JOIN LATERAL (SELECT json_agg(b) AS featuredBlogs FROM b) b ON true
                    LEFT JOIN LATERAL (SELECT json_agg(t) AS featuredTattoos FROM t) t ON true
                WHERE p.url = pageurl
                ORDER BY p."postDate" DESC
                INTO result;
            RETURN result;
            END
            $$ LANGUAGE plpgsql;
    
            ALTER FUNCTION public.pagedata(text)
            OWNER TO develop;
    `
};
