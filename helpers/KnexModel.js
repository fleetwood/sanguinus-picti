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

  /**
   * References views in the database.
   * ToDo: Add views to migrations
   */
  get dbviews() {
    return {
      page_author: 'page_author',
      tattoo_author: 'tattoo_author'
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
      select: options.select || '*',
      name: options.name || this.tableName,
      where: options.where || {},
      orderCol: options.orderCol || this.key,
      orderDir: options.orderDir || 'asc'
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
    knex.select(options.select)
      .from(options.name)
      .where(options.where)
      .orderBy(options.orderCol, options.orderDir)
      .then(results => done(null, results))
      .catch(err => done(err));
  }

  /**
   * Get a single entity
   * @param {KnexOptions} params
   * @see KnexOptions
   * @param {Function} done 
   */
  one(params, done) {
    const options = this.KnexOptions(params);
    knex.select(options.select)
      .from(options.name)
      .where(options.where)
      .orderBy(options.orderCol, options.orderDir)
      .then(results => done(null, results[0]))
      .catch(err => done(err));
  }

  /**
 * Get all featured blogs
 * @param {function} done 
 */
  featuredBlogList(done) {
    return this.all({
        name: this.dbviews.page_author,
        where: {featured: true},
        orderCol: 'postDate', 
        orderDir: 'desc'
      },
      done);
  }

  /**
 * Get all featured tattoos
 * @param {function} done 
 */
  featuredTattooList(done) {
    return this.all({
        name: this.dbviews.tattoo_author,
        where: {featured: true},
        orderCol: 'postDate',
        orderDir: 'desc'
      },
      done);
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
