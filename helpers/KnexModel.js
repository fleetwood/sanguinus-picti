const config = require('config');
const knex = require('knex')(config.knex);
const validator = require('lx-valid');

/**
 * Object model coupled with knex methods
 */
class KnexModel {
  constructor(definition) {
    this._knex = knex;
    this.tableName = definition.tableName;
    this.key = definition.key;
    this.schema = definition.schema;
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
        page_author: 'page_author'
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
   * @param {Boolean} isUpdate 
   */
  validate(data, isUpdate = false) {
    const validate = validator.getValidationFunction();
    return validate(data, this.schema, { isUpdate: isUpdate });
  };

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
      orderCol: options.orderCol || this.key,
      orderDir: options.orderDir || this.tables.sort.desc
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
      const k = knex
        .debug(true)
        .select(options.select)
        .from(options.name)
        .where(options.where)
        .orderBy(options.orderCol, options.orderDir)
        .then(results => resolve(results))
        .catch(err => reject(err));
      console.log(k.toString());
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
        knex
        .debug(true)
        .select(options.select)
        .from(options.name)
        .where(options.where)
        .orderBy(options.orderCol, options.orderDir)
        .then(results => resolve(results[0]))
        .catch(err => reject(err));
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
      const sql = knex.select(options.select)
      .from(options.name)
      .where(options.where)
      .join(options.join, options.joinon)
      .orderBy(options.orderCol, options.orderDir)
      .then(results => resolve(results))
      .catch(err => reject(err));
      console.log(sql.toString());
    });
  }

  /**
 * Get all featured blogs
 * @returns Promise( resolve, reject)
 */
  featuredBlogList() {
    return this.all({
      name: KnexModel.tables.views.page_author,
      where: {featured: true, pageType: KnexModel.pageTypes.blog},
      orderCol: this.tables.postDate, 
      orderDir: this.tables.sort.desc
    });
  }

  /**
 * Get all featured tattoos
 * @returns Promise( resolve, reject) 
 */
  featuredTattooList() {
    return this.all({
      name: KnexModel.tables.views.page_author,
      where: {featured: true, pageType: KnexModel.pageTypes.tattoos},
      orderCol: this.tables.postDate, 
      orderDir: this.tables.sort.desc
    });
  }

  /**
   * Get featuredBlogs, featuredTats, allBlogs, allTats
   * @returns Promise(resolve, reject)
   */
  getMenus() {
    const tables = KnexModel.tables;
    const allBlogOptions = {
      name: tables.pages,
      where: { pageType: tables.blog},
      orderCol: tables.postDate,
      orderDir: tables.sort.desc
    };
    const allTatOptions = {
      name: tables.pages,
      where: { pageType: tables.tattoos},
      orderCol: tables.postDate,
      orderDir: tables.sort.desc
    };
    return new Promise((resolve, reject) => {
      this.featuredBlogList()
        .then((featuredBlogs) => {
          this.featuredTattooList()
          .then((featuredTats) => {
            this.all(allBlogOptions)
            .then((allBlogs) => {
              this.all(allTatOptions)
              .then((allTats) => {
                resolve({
                  featuredBlogs,
                  featuredTats,
                  allBlogs,
                  allTats
                });
              })
            })
          })
      })
      .catch(err => reject(err));
    });
  }

  /**
   * 
   * @param {*} data 
   * @returns Promise(resolve, reject)
   */
  insert(data) {
    return new Promise((resolve,reject) => {
      const validation = this.validate(data);
      if (validation.valid) {
        knex.insert(data)
        .into(this.tableName)
        .then(result => {
          knex.select('*')
          .from(this.tableName)
          .where({ id: result[0] })
          .then(entity => resolve(entity[0]))
          .catch(err => reject(err))
          ;
        })
        .catch(err => reject(err))
        ;
      } else {
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
        knex(this.tableName)
        .where('id', entityId)
        .update(entity)
        .then(() => {
          knex.select('*')
          .from(this.tableName)
          .where({ id: entityId })
          .then(updated => resolve(updated[0]))
          .catch(err => reject(err))
          ;
        })
        .catch(err => reject(err))
        ;
      } else {
        reject(new Error('Validation errors: '+ validation.errors.toString()));
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
    return knex(this.tableName)
      .where('id', entityId)
      .delete()
      .then(() => done(null))
      .catch(err => done(err));
  };
};

module.exports = KnexModel;
