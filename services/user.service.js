'use strict';

const { User } = require('../model');
const buildQuery = require('../utils');

module.exports = {
  getUsers({ order, page, size }) {
    const query = buildQuery({ order, page, size });
    return User.findAll(query);
  },
  getUser(id) {
    return User.findByPk(id);
  },
  createUser(value) {
    return User.create(value);
  },
  removeUser(id) {
    return User.destroy({ where: { id } });
  },
  async updateUser(id, value) {
    const user = await User.findByPk(id);
    return user && user.update(value);
  },
};
