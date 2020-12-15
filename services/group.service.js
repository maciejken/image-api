'use strict';

const { Group } = require('../model');
const buildQuery = require('../utils');

module.exports = {
  getGroups({ order, page, size }) {
    const query = buildQuery({ order, page, size });
    return Group.findAll(query);
  },
  getGroup(id) {
    return Group.findByPk(id);
  },
  createGroup(value) {
    return Group.create(value);
  },
  removeGroup(id) {
    return Group.destroy({ where: { id } });
  },
  async updateGroup(id, value) {
    const group = await Group.findByPk(id);
    return group && group.update(value);
  },
};
