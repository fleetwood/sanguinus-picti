const config = require('config');
const knex = require('knex')(config.knex);
const validator = require('lx-valid');

class KnexModel {
  constructor(definition) {
    this._knex = knex;
    this.tableName = definition.tableName;
    this.key = definition.key;
    this.schema = definition.schema;
  }

  get pugviews() {
    return {
      base: 'layouts/base',
      error: 'layouts/error',
      home: 'layouts/home',
      left: 'layouts/left',
      right: 'layouts/right'
    };
  };

  get dbviews() {
    return {
      page_author: 'page_author',
      tattoo_author: 'tattoo_author'
    };
  };

  validate(data, isUpdate = false) {
    const validate = validator.getValidationFunction();
    return validate(data, this.schema, { isUpdate: isUpdate });
  };

  all(options, done) {
    const orderCol = options.orderBy ? options.orderBy.col : this.key;
    const orderDir = options.orderBy ? options.orderBy.dir : 'asc';
    knex.select(options.select || '*')
      .from(options.name)
      .where(options.where || {})
      .orderBy(orderCol, orderDir)
      .then(results => done(null, results))
      .catch(err => done(err))
      ;
  }

  one(options, done) {
    const orderCol = options.orderBy ? options.orderBy.col : this.key;
    const orderDir = options.orderBy ? options.orderBy.dir : 'asc';
    knex.select(options.select || '*')
      .from(options.name)
      .where(options.where || {})
      .orderBy(orderCol, orderDir)
      .then(results => done(null, results[0]))
      .catch(err => done(err))
      ;
  }
/**
 * Get all featured blogs
 * @param {function} done 
 */
  featuredBlogList(done) {
    return this.all({
      name: this.dbviews.page_author,
      where: {featured: true},
      orderBy: {col: 'posted_date', dir: 'desc'}
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
      orderBy: {col: 'posted_date', dir: 'desc'}
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
