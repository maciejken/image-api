'use strict';

const { buildQuery } = require('../utils');

module.exports = class CrudService {
  model;
  linkedModels;
  identifierKey;

  constructor(settings) {
    const { model, linkedModels, identifierKey } = settings;
    this.model = model;
    this.linkedModels = linkedModels;
    this.identifierKey = identifierKey || 'id';

    if (linkedModels) {
      for (const lm of linkedModels) {
        const { through, updateOnDuplicate } = lm;
        this[`create${lm.modelName}`] = async (params) => {
          const { value, foreignKey, targetKey, otherKey } = params;
          let val;
          if (through) {
            const resp = await lm.model.findOrCreate({
              where: value,
            });
            await through.findOrCreate({
              where: {
                [foreignKey.name]: foreignKey.value,
                [otherKey.name]: resp[0][targetKey.name],
              }
            });
            val = resp;
          } else {
            val = await lm.model.findOrCreate({
              where: { ...value, [foreignKey.name]: foreignKey.value },
            });
          }
          return val;
        };
        this[`create${lm.modelName}s`] = async (params) => {
          const { value, foreignKey, targetKey, otherKey } = params;
          if (through) {
            data = await lm.model.bulkCreate(value, { updateOnDuplicate });
            const throughData = data.map(d => ({
              [foreignKey.name]: d[foreignKey.name],
              [otherKey.name]: d[targetKey.name],
            }));
            await through.bulkCreate(throughData, { ignoreDuplicates: true });
          } else {
            data = await lm.model.bulkCreate(value, { updateOnDuplicate });
          }
          return data;
        };
        this[`get${lm.modelName}`] = async (params) => {
          let val = null;
          const { foreignKey, targetKey, otherKey } = params;
          if (through) {
            const throughInstance = await through.findOne({
              where: {
                [foreignKey.name]: foreignKey.value,
                [otherKey.name]: otherKey.value,
              }
            });
            val = throughInstance && await lm.model.findByPk(targetKey.value);
          } else {
            val = await lm.model.findOne({
              where: {
                [foreignKey.name]: foreignKey.value,
                [targetKey.name]: targetKey.value,
              },
              include: lm.include,
            });
          }
          return val;
        };
        this[`get${lm.modelName}s`] = async (params) => {
          let query;
          const { foreignKey, targetKey, otherKey } = params;
          if (through) {
            const throughInstances = await through.findAll({
              where: {
                [foreignKey.name]: foreignKey.value,
              }
            });
            const ids = throughInstances.map(instance => instance[otherKey.name]);
            query = { where: { [targetKey.name]: ids } };
          } else {
            query = { where: { [foreignKey.name]: foreignKey.value } };
          }
          return await lm.model.findAll(query);
        };
        this[`update${lm.modelName}`] = async (params) => {
          const { value, foreignKey, targetKey, otherKey } = params;
          let val;
          if (through) {
            const throughInstance = await through.findOne({
              where: {
                [foreignKey.name]: foreignKey.value,
                [otherKey.name]: otherKey.value,
              }
            });
            const instance = throughInstance && await lm.model.findByPk(targetKey.value);
            val = instance && await instance.update(value);
            const idChanged = val && val[targetKey.name] !== otherKey.value;
            if (idChanged) {
              await throughInstance.update({ [otherKey.name]: val[targetKey.name] });
            }
          } else {
            const instance = await lm.model.findOne({
              where: {
                // keep foreignKey to ensure relation
                [foreignKey.name]: foreignKey.value,
                [targetKey.name]: targetKey.value,
              }
            });
            val = instance && await instance.update(value);            
          }
          return val;
        };
        this[`remove${lm.modelName}`] = async (params) => {
          const { foreignKey, targetKey, otherKey } = params;
          let val;
          if (through) {
            val = await through.destroy({
              where: {
                [foreignKey.name]: foreignKey.value,
                [otherKey.name]: otherKey.value,
              }
            });
          } else {
            val = await lm.model.destroy({
              where: {
                // keep foreignKey to ensure relation
                [foreignKey.name]: foreignKey.value,
                [targetKey.name]: targetKey.value,
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
