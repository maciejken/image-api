'use strict';
const buildQuery = require('../utils/build-query');

function CrudService({ model, name, linkedModels }) {
  this.model = model;
  this.name = name;
  this.linkedModels = linkedModels;
}

CrudService.prototype.create = (value) => this.model.create(value);
CrudService.prototype.readOne = (id) => this.model.findByPk(id);
CrudService.prototype.readMany = ({ page, size, order }) => {
  const query = buildQuery({ page, size, order });
  return this.model.findAll(query);
};
CrudService.prototype.update = async (id, value) => {
  const val = await this.model.findByPk(id);
  return val && val.update(value);
};
CrudService.prototype.destroy = (id) => this.model.destroy({ where: { id } });

for (const m of this.linkedModels) {
  CrudService.prototype[`create${m.name}`] = async (id, value) => {
    const itemToLink = await m.model.create(value);
    await m.linkingModel.create({
      [`${this.name.toLowerCase()}Id`]: id,
      [`${m.name.toLowerCase()}Id`]: itemToLink.id,
    });
    return this.model.findByPk(id);
  };
  CrudService.prototype[`unlink${m.name}`] = (id, linkedItemId) => {
    return m.linkingModel.destroy({
      where: {
        [`${this.name.toLowerCase()}Id`]: id,
        [`${m.name.toLowerCase()}Id`]: linkedItemId
      }
    });
  };
}

module.exports = CrudService;
