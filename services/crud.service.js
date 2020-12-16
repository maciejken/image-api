'use strict';

const { buildQuery, toCamelCase, uncapitalize } = require('../utils');

module.exports = class CrudService {
  model;
  linkedModels;
  identifier;

  constructor(model, linkedModels) {
    this.model = model || {};
    this.linkedModels = linkedModels || [];
    this.identifier = `${model.name}Id`;
    if (linkedModels) {
      for (const lm of linkedModels) {
        const ModelName = lm.model && toCamelCase(lm.model.name);
        const subIdentifier = `${uncapitalize(ModelName)}Id`;
        this[`create${ModelName}`] = async (id, value) => {
          value = { ...value, [this.identifier]: id };
          return lm.model.create(value);
        };
        this[`get${ModelName}`] = async (id, subId) => {
          const { include } = lm;
          return lm.model.findOne({
            where: {
              [this.identifier]: id,
              id: subId,
            },
            include,
          });
        };
        this[`get${ModelName}s`] = async (id) => {
          return lm.model.findAll({ where: { [this.identifier]: id }});
        };
        this[`update${ModelName}`] = async (id, subId, value) => {
          const instance = await lm.model.findOne({ where: {
            [this.identifier]: id,
            id: subId,
          } });
          return instance && instance.update(value);
        };
        this[`remove${ModelName}`] = async (id, subId) => {
          return lm.model.destroy({ where: {
            [this.identifier]: id,
            [subIdentifier]: subId,
          } });
        };
      }    
    }
  }

  create(value) {
    return this.model.create(value);
  }

  readOne(id) {
    return this.model.findByPk(id, {
      include: this.linkedModels
        .filter(lm => lm.eager)
        .map(lm => {
          const { model, through, as } = lm;
          const val = { model, through, as };
          if (lm.include) {
            val.include = lm.include;
          }
          return val;
        })
      });
  }

  readMany({ page, size, order }) {
    const query = buildQuery({ page, size, order });
    return this.model.findAll(query);
  }

  async update(id, value) {
    const val = await this.model.findByPk(id);
    return val && val.update(value);
  }

  destroy(id) {
    return this.model.destroy({ where: { id } });
  }

};
