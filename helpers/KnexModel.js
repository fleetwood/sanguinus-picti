const config = require('config');
const knex = require('knex')(config.knex);
const validator = require('lx-valid');

class KnexModel {
  constructor(definition) {
    this._knex = knex;
    this.tableName = definition.tableName;
    this.schema = definition.schema;
  }

  get views() {
    return {
      page_author: 'page_author'
    };
  };

  validate(data, isUpdate = false) {
    const validate = validator.getValidationFunction();
    return validate(data, this.schema, { isUpdate: isUpdate });
  };

  list(done) {
    knex.select('*')
      .from(this.tableName)
      .then(results => done(null, results))
      .catch(err => done(err))
      ;
  };

  all(name, where, done) {
    knex.select('*')
      .from(name)
      .where(where)
      .then(results => done(null, results))
      .catch(err => done(err))
      ;
  }

  one(name, where, done) {
    knex.select('*')
      .from(name)
      .where(where)
      .then(results => done(null, results[0]))
      .catch(err => done(err))
      ;
  }

  get(entityid, done) {
    knex.select('*')
      .from(this.tableName)
      .where({ id: entityid })
      .then(results => done(null, results[0]))
      .catch(err => done(err))
      ;
  };

  getWhere(where, done) {
    knex.select('*')
      .from(this.tableName)
      .where(where)
      .then(results => done(null, results[0]))
      .catch(err => done(err))
      ;
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

  delete(taskId, done) {
    knex(this.tableName)
      .where('id', taskId)
      .delete()
      .then(() => done(null))
      .catch(err => done(err))
      ;
  }
};

module.exports = KnexModel;
