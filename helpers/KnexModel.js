const knex = require('../database/knex');
const Validator = require('jsonschema').Validator;
const validator = new Validator();

/**
 * Object model coupled with knex methods
 */
class KnexModel {
  constructor(definition) {
    this._knex = knex;
    this.tableName = definition.tableName;
    this.key = definition.key;
    this.schema = definition.fields;
  }

  static get tables() {
    return {
      all: '*',
      pages: 'pages',
      blog: 'blog',
      tattoos: 'tattoos',
      postDate: 'postDate',
      sort: {
        asc: 'asc',
        desc: 'desc'
      },
      users: 'users',
      views: {
        all_pages: 'all_pages',
        blogs: 'blogs',
        cTats: 'cf_tats',
        jTats: 'jf_tats',
        menus: 'menus',
        tattoos: 'tattoos'
      }
    }
  };

  /**
   * References types of pages in 'pages' table
   */
  static get pageTypes() {
    return {
      blog: 'blog',
      tattoos: 'tattoos'
    };
  };

  /**
   * Validate the data against the model schema
   * @param {JSON} data 
   */
  validate(data) {
    return validator.validate(data, this.schema);
  };

  debug(str) {
    if (knex.debug) {
      console.log(str);
    }
  }

  /**
   * 
   * @param {{select, name, where, orderCol, orderDir}} options 
   */
  KnexOptions(options) {
    return {
      select: options.select || this.tables.all,
      name: options.name || this.tableName,
      where: options.where || {},
      // join: options.join || null,
      // joinon: options.joinon || null,
      orderCol: options.orderCol || null,
      orderDir: options.orderDir || null
    };
  }

  /**
   * Get all entities matching options criteria
   * @see KnexOptions
   * @param {KnexOptions} params 
   * @returns Promise(resolve, reject)
   */
  all(params) {
    const options = this.KnexOptions(params);
    return new Promise((resolve, reject) => {
      if (options.orderCol) {
        const k = knex
          .select(options.select)
          .from(options.name)
          .where(options.where)
          .orderBy(options.orderCol, options.orderDir)
          .then(results => {
            resolve(results); // don't minimize this, in case of further debugging....
          })
          .catch(err => {
            reject(err);
          });
        this.debug(k.toString);
      }
      else {
        const k = knex
          .select(options.select)
          .from(options.name)
          .where(options.where)
          .then(results => {
            resolve(results); // don't minimize this, in case of further debugging....
          })
          .catch(err => {
            reject(err);
          });
        this.debug(k.toString);
      }
    });
  }

  /**
   * Get a single entity
   * @param {KnexOptions} params
   * @see KnexOptions
   * @returns Promise(resolve, reject)
   */
  one(params) {
    const options = this.KnexOptions(params);
    return new Promise((resolve, reject) => {
      const k = knex
        .select(options.select)
        .from(options.name)
        .where(options.where)
        .orderBy(options.orderCol, options.orderDir)
        .then(results => resolve(results[0]))
        .catch(err => reject(err));
      this.debug(k.toString);
    });
  }

  /**
     * 
     * @param {*} params 
     * @returns Promise(resolve, reject)
     */
  join(params) {
    const options = this.KnexOptions(params);
    return new Promise((resolve, reject) => {
      const k = knex.select(options.select)
        .from(options.name)
        .where(options.where)
        .join(options.join, options.joinon)
        .orderBy(options.orderCol, options.orderDir)
        .then(results => resolve(results))
        .catch(err => reject(err));
      this.debug(k.toString);
    });
  }

  /**
   * Get featuredBlogs, featuredTats, allBlogs, allTats
   * @returns Promise(resolve, reject)
   */
  getMenus() {
    return new Promise((resolve, reject) => {
      this.all({
        name: KnexModel.tables.views.menus
      })
      .then(menus => resolve(menus[0]))
      .catch(err => reject(err));
    });
  }

  getBlogs() {
    return new Promise((resolve, reject) => {
      this.all({
        name: KnexModel.tables.views.blogs
      })
      .then(blogs => resolve(blogs[0]))
      .catch(err => reject(err));
    }); 
  }

  getTattoos(byUser = "") {
    return new Promise((resolve, reject) => {
      this.all({
        name: byUser.length > 0 ? byUser : KnexModel.tables.views.blogs
      })
      .then(blogs => resolve(blogs[0]))
      .catch(err => reject(err));
    }); 
  }

  /**
   * raw() knex call to pageData() proc.
   * @param {string} url 
   * @returns Promise(resolve, reject)
   */
  pageData(url) {
    return new Promise((resolve, reject) => {
      const k = knex
        .raw(`select pageData('${url}')`)
        .then(result => {
          resolve(result.rows[0].pagedata);
        })
        .catch(err => {
          reject(err);
        });
      this.debug(k.toString());
    });
  }

  /**
   * 
   * @param {*} data 
   * @returns Promise(resolve, reject)
   */
  insert(data) {
    return new Promise((resolve, reject) => {
      const validation = this.validate(data);
      if (validation.valid) {
        const k = knex
          .insert(data)
          .into(this.tableName)
          .returning('*')
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
        this.debug(k.toString);
      }
      else {
        reject(new Error('Validation errors :' + validation.errors.toString()));
      }
    })
  };

  /**
   * 
   * @param {*} entityId 
   * @param {*} entity 
   * @returns Promise(resolve, reject)
   */
  update(entityId, entity) {
    return new Promise((resolve, reject) => {
      const validation = this.validate(entity, true);
      if (validation.valid) {
        const k = knex(this.tableName)
          .where('id', entityId)
          .update(entity)
          .then(() => {
            var s = knex.select('*')
              .from(this.tableName)
              .where({ id: entityId })
              .then(updated => {
                resolve(updated[0]);
              });
              this.debug(s.toString);
          })
          .catch(err => {
            reject(err);
          });
        this.debug(k.toString);
      } else {
        reject(new Error('Validation errors: ' + validation.errors.toString()));
      }
    })
  };

  /**
   * 
   * @param {*} entityId 
   * @returns Promise(knex)
   * @see knex
   */
  delete(entityId) {
    return new Promise((resolve, reject) => {
      const k = knex(this.tableName)
        .where('id', entityId)
        .delete()
        .then(() => resolve({success: true}))
        .catch(err => reject(err));
      this.debug(k.toString);
    });
  };
};

module.exports = KnexModel;
