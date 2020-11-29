'use strict';
const buildQuery = require('../utils/build-query');

function CrudService(opts) {
  this.create = opts.create;
  this.readOne = opts.readOne;
  this.readMany = opts.readMany;
  this.update = opts.update;
  this.destroy = opts.destroy;
}

if (opts.create) {
  CrudService.prototype.create = (value) => this.create(value);
}
if (opts.readOne) {
  CrudService.prototype.readOne = (id) => this.readOne(id);
} else {
  CrudService.prototype.readMany = ({ page, size, order }) => {
    const query = buildQuery({ page, size, order });
    return this.readMany(query);
  };   
}
if (opts.update) {
  CrudService.prototype.update = async (id, value) => {
    const val = await this.readOne(id);
    return val && val.update(value);
  };  
}
if (opts.destroy) {
  CrudService.prototype.destroy = (id) => this.destroy({ where: { id } });
}

for (let m of this.opts.linkedModels) {
  if (m.create) {
    CrudService.prototype[`create${m.name}`] = m.create;
  }
  if (m.readOne) {
    CrudService.prototype[`readOne${m.name}`] = m.readOne;
  } else {
    const name = m.pluralName || `${m.name}s`; 
    CrudService.prototype[`readMany${name}`] = m.readMany;
  }
  if (m.destroy) {
    CrudService.prototype[`destroy${m.name}`] = m.destroy;
  }
}

module.exports = CrudService;
