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
        const subIdentifier = uncapitalize(ModelName) + 'Id';
        const { through } = lm;
        this[`create${ModelName}`] = async (id, value) => {
          let val;
          if (through) {
            let instance = await lm.model.findOne({ where: value });
            const throughVal = {
                [this.identifier]: id,
                [subIdentifier]: instance.id,              
            };
            if (instance) {
              const throughInstance = await through.findOne({ where: throughVal });
              !throughInstance && await through.create(throughVal);
            } else {
              instance = await lm.model.create(value);
              await through.create(throughVal);              
            }
            val = instance;
          } else {
            value = { ...value, [this.identifier]: id };
            val = await lm.model.create(value);
          }
          return val;
        };
        this[`get${ModelName}`] = async (id, subId) => {
          const { include } = lm;
          let val = null;
          if (through) {
            const throughInstance = await through.findOne({
              where: {
                [this.identifier]: id,
                [subIdentifier]: subId,
              }
            });
            val = throughInstance && await lm.model.findByPk(subId);
          } else {
            val = await lm.model.findOne({
              where: {
                [this.identifier]: id,
                id: subId,
              },
              include,
            });
          }
          return val;
        };
        this[`get${ModelName}s`] = async (id) => {
          let val;
          if (through) {
            const throughInstances = await through.findAll({
              where: { [this.identifier]: id }
            });
            const ids = throughInstances.map(instance => instance[subIdentifier]);
            val = await lm.model.findAll({ where: { id: ids } });
          } else {
            val = await lm.model.findAll({ where: { [this.identifier]: id }});
          }
          return val;
        };
        this[`update${ModelName}`] = async (id, subId, value) => {
          let val;
          if (through) {
            const throughInstance = await through.findOne({
              where: {
                [this.identifier]: id,
                [subIdentifier]: subId,
              }
            });
            const instance = throughInstance && await lm.model.findByPk(subId);
            val = instance && instance.update(value);
          } else {
            const instance = await lm.model.findOne({ where: {
              [this.identifier]: id,
              id: subId,
            } });
            val = instance && await instance.update(value);            
          }
          return val;
        };
        this[`remove${ModelName}`] = async (id, subId) => {
          let val;
          if (through) {
            val = await through.destroy({
              where: {
                [this.identifier]: id,
                [subIdentifier]: subId,
            }});
          } else {
            val = await lm.model.destroy({
              where: {
                [this.identifier]: id,
                id: subId,
            }});
          }
          return val;
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
    const instance = await this.model.findByPk(id);
    return instance && instance.update(value);
  }

  destroy(id) {
    return this.model.destroy({ where: { id } });
  }

};
