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
   * @param {Function} done 
   */
  all(params, done) {
    const options = this.KnexOptions(params);
    const k = knex
      .debug(true)
      .select(options.select)
      .from(options.name)
      .where(options.where)
      .orderBy(options.orderCol, options.orderDir)
      .then(results => done(null, results))
      .catch(err => done(err));
    console.log(k.toString());
  }

  /**
   * Get a single entity
   * @param {KnexOptions} params
   * @see KnexOptions
   * @param {Function} done 
   */
  one(params, done) {
    const options = this.KnexOptions(params);
    knex
      .debug(true)
      .select(options.select)
      .from(options.name)
      .where(options.where)
      .orderBy(options.orderCol, options.orderDir)
      .then(results => done(null, results[0]))
      .catch(err => done(err));
  }

  join(params, done) {
    const options = this.KnexOptions(params);
    const sql = knex.select(options.select)
      .from(options.name)
      .where(options.where)
      .join(options.join, options.joinon)
      .orderBy(options.orderCol, options.orderDir);
    
    console.log(sql.toString());
    
    return sql
      .then(results => done(null, results))
      .catch(err => done(err));
  }

  /**
 * Get all featured blogs
 * @param {function} done 
 */
  featuredBlogList(done) {
    return this.all({
      name: KnexModel.tables.views.page_author,
      where: {featured: true, pageType: KnexModel.pageTypes.blog},
      orderCol: this.tables.postDate, 
      orderDir: this.tables.sort.desc
    }, done);
  }

  /**
 * Get all featured tattoos
 * @param {function} done 
 */
  featuredTattooList(done) {
    return this.all({
      name: KnexModel.tables.views.page_author,
      where: {featured: true, pageType: KnexModel.pageTypes.tattoos},
      orderCol: this.tables.postDate, 
      orderDir: this.tables.sort.desc
    }, done);
  }

  insert(data, done) {
    const validation = this.validate(data);
    if (validation.valid) {
      knex.insert(data)
        .into(this.tableName)
        .then(result => {
          knex.select('*')
            .from(this.tableName)
            .where({ id: result[0] })
            .then(entity => done(null, entity[0]))
            .catch(err => done(err))
            ;
        })
        .catch(err => done(err))
        ;
    } else {
      done(validation.errors);
    }
  };

  update(entityId, entity, done) {
    const validation = this.validate(entity, true);
    if (validation.valid) {
      knex(this.tableName)
        .where('id', entityId)
        .update(entity)
        .then(() => {
          knex.select('*')
            .from(this.tableName)
            .where({ id: entityId })
            .then(updated => done(null, updated[0]))
            .catch(err => done(err))
            ;
        })
        .catch(err => done(err))
        ;
    } else {
      done(validation.errors);
    }
  };

  delete(entityId, done) {
    knex(this.tableName)
      .where('id', entityId)
      .delete()
      .then(() => done(null))
      .catch(err => done(err))
      ;
  }

};

module.exports = KnexModel;
