'use strict';

const { buildQuery, toTitleCase } = require('../utils');

module.exports = class CrudService {
  model;
  linkedModels;

  constructor(model, linkedModels) {
    this.model = model || {};
    this.linkedModels = linkedModels || [];
    if (linkedModels) {
      for (const lm of linkedModels) {
        const ModelName = lm.model && toTitleCase(lm.model.name);
        this[`create${ModelName}`] = async (id, value) => {
          const instance = await this.model.findByPk(id);
          let createdValue;
          if (instance) {
            createdValue = await instance[`create${ModelName}`].call(instance, value);
          }
          return createdValue;
        };
        this[`get${ModelName}`] = async (id, linkedItemId) => {
          const instance = await this.model.findByPk(id);
          const { include } = lm;
          const linkedInstance = await lm.model.findByPk(linkedItemId, { include });
          let val = null;
          const isLinked = await instance[`has${ModelName}`].call(instance, linkedInstance);
          if (isLinked) {
            val = linkedInstance;
          }
          return val;
        };
        this[`remove${ModelName}`] = async (id, linkedItemId) => {
          const instance = await this.model.findByPk(id);
          let result;
          if (instance) {
            const removable = await instance[`get${ModelName}s`].call(instance)
              .find(item => item.id = linkedItemId);
            result = removable && await instance[`remove${ModelName}`].call(instance, removable);
          }
          return result;
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
        .map(lm => ({ model: lm.model, through: lm.through }))
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
