'use strict';

const { buildQuery } = require('../utils');

module.exports = class CrudService {
  model;
  linkedModels;
  identifierKey;
  foreignKey;

  constructor(settings) {
    const { model, linkedModels, identifierKey, foreignKey } = settings;
    this.model = model;
    this.linkedModels = linkedModels;
    this.identifierKey = identifierKey || 'id';
    this.foreignKey = foreignKey;

    if (linkedModels) {
      for (const lm of linkedModels) {
        const { through } = lm;
        const identifierKey = lm.identifierKey || 'id';
        this[`create${lm.modelName}`] = async (value) => {
          let val;
          if (through) {
            const resp = await lm.model.findOrCreate({ where: value });
            const throughVal = {
                [this.foreignKey]: value[this.foreignKey],
                [lm.otherKey]: resp[0][identifierKey],
            };
            await through.findOrCreate({ where: throughVal });
            val = resp;
          } else {
            val = await lm.model.findOrCreate({ where: value });
          }
          return val;
        };
        this[`get${lm.modelName}`] = async (value) => {
          let val = null;
          if (through) {
            const throughInstance = await through.findOne({ where: {
              [this.foreignKey]: value[this.foreignKey],
              [lm.otherKey]: value[identifierKey],
            } });
            val = throughInstance && await lm.model.findByPk(value[identifierKey]);
          } else {
            val = await lm.model.findOne({
              where: {
                [this.foreignKey]: value[this.foreignKey],
                [identifierKey]: value[identifierKey],
              },
              include: lm.include,
            });
          }
          return val;
        };
        this[`get${lm.modelName}s`] = async (value) => {
          let query;
          if (through) {
            const throughInstances = await through.findAll({ where: value });
            const ids = throughInstances.map(instance => instance[lm.otherKey]);
            query = { where: { [identifierKey]: ids } };
          } else {
            query = { where: value };
          }
          return await lm.model.findAll(query);
        };
        this[`update${lm.modelName}`] = async (id, value) => {
          let val;
          if (through) {
            const throughInstance = await through.findOne({
              where: {
                [this.foreignKey]: value[this.foreignKey],
                [lm.otherKey]: id,
              }
            });
            const instance = throughInstance && await lm.model.findByPk(id);
            val = instance && await instance.update(value);
            const idChanged = val && val[identifierKey] !== id;
            if (idChanged) {
              await throughInstance.update({ [lm.otherKey]: val[identifierKey] });
            }
          } else {
            const instance = await lm.model.findOne({
              where: {
                // keep foreignKey to ensure relation
                [this.foreignKey]: value[this.foreignKey],
                [identifierKey]: id,
              }
            });
            val = instance && await instance.update(value);            
          }
          return val;
        };
        this[`remove${lm.modelName}`] = async (value) => {
          let val;
          if (through) {
            val = await through.destroy({
              where: {
                [this.foreignKey]: value[this.foreignKey],
                [lm.otherKey]: value[identifierKey]
              }
            });
          } else {
            val = await lm.model.destroy({
              where: {
                // keep foreignKey to ensure relation
                [this.foreignKey]: value[this.foreignKey],
                [identifierKey]: value[identifierKey],
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

  getOne(id) {
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

  getMany({ page, size, order }) {
    const query = buildQuery({ page, size, order });
    return this.model.findAll(query);
  }

  async update(id, value) {
    const instance = await this.model.findByPk(id);
    return instance && instance.update(value);
  }

  remove(id) {
    return this.model.destroy({ where: { [this.identifierKey]: id } });
  }

};
