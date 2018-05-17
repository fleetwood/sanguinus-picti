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

  debug(query) {
    if (knex.debug) {
      console.log(query.toString());
    }
  }

  /**
   * 
   * @param {{select, name, where, orderCol, orderDir}} params 
   */
  withOptions(params) {
    const options =  {
      select: params.select || this.tables.all,
      from: params.from || this.tableName,
      where: params.where || {},
      // join: options.join || null,
      // joinon: options.joinon || null,
      orderCol: params.orderCol || null,
      orderDir: params.orderDir || null
    };
    if (options.orderCol) {
      return knex
        .select(options.select)
        .from(options.from)
        .where(options.where)
        .orderBy(options.orderCol, options.orderDir);
    }
    return knex
      .select(options.select)
      .from(options.from)
      .where(options.where);
  }

  /**
   * Get all entities matching options criteria
   * @param {Object} params 
   * @returns Promise(resolve, reject)
   */
  all(params) {
    return new Promise((resolve, reject) => {
      const k = this
        .withOptions(params)
        .then(results => {
          resolve(results); // don't minimize this, in case of further debugging....
        })
        .catch(err => {
          reject(err);
        });
      this.debug(k);
    });
  }

  /**
   * Get a single entity
   * @param {Object} params
   * @returns Promise(resolve, reject)
   */
  one(params) {
    return new Promise((resolve, reject) => {
      const k = this
        .withOptions(params)
        .then(results => {
          resolve(results[0]); // don't minimize this, in case of further debugging....
        })
        .catch(err => {
          reject(err);
        });
      this.debug(k);
    });
  }

  /**
     * 
     * @param {Object} params 
     * @description Note that 'join' requires a Raw string
     * @returns Promise(resolve, reject)
     */
  join(params) {
    return new Promise((resolve, reject) => {
      const k = this
        .withOptions(params)
        .join(options.join)
        .then(results => {
          resolve(results);
        })
        .catch(err => {
          reject(err);
        });
      this.debug(k);
    });
  }

  /**
   * Get featuredBlogs, featuredTats, allBlogs, allTats
   * @returns Promise(resolve, reject)
   */
  getMenus() {
    return new Promise((resolve, reject) => {
      const k = this.all({
        from: KnexModel.tables.views.menus
      })
      .then(results => {
        resolve(results[0]); // don't minimize this, in case of further debugging....
      })
      .catch(err => {
        reject(err);
      });
      this.debug(k);
    });
  }

  getBlogs() {
    return new Promise((resolve, reject) => {
      const k = this.all({
        from: KnexModel.tables.views.blogs
      })
      .then(results => {
        resolve(results[0]);
      })
      .catch(err => {
        reject(err);
      });
      this.debug(k);
    }); 
  }

  getTattoos(byUser = "") {
    return new Promise((resolve, reject) => {
      // if user select cTats or jTats, otherwise tattoos
      const options = {
        from: KnexModel.tables.views.tattoos
      };
      if (byUser.length > 0) {
        options['where'] = {firstname: byUser};
      }
      const k = this
        .all(options)
        .then(results => {
          resolve(results[0]); // don't minimize this, in case of further debugging....
        })
        .catch(err => {
          reject(err);
        });
        this.debug(k);
    });
  }

  getArtists() {
    return new Promise((resolve, reject) => {
      this.all({
        from: KnexModel.tables.users
      })
      .then(users => {
        this.all({
          from: KnexModel.tables.views.cTats
        })
        .then(cTats => {
          this.all({
            from: KnexModel.tables.views.jTats
          })
          .then(jTats => {
            resolve({
              john: {
                info: users.find(u => u.firstname == 'John'), //todo: lookup Array find
                tattoos: jTats
              },
              christina: {
                info: users.find(u => u.firstname == 'Christina'), //todo: lookup Array find
                tattoos: cTats
              }
            });
          });
        });
      })
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
      this.debug(k);
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
        this.debug(k);
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
        this.debug(k);
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
      this.debug(k);
    });
  };
};

module.exports = KnexModel;
