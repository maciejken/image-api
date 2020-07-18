'use strict';

var { User } = require('../model');
var buildQuery = require('../utils/build-query');

module.exports = class UserService {

  getUsers({ order, page, size }) {
    var query = buildQuery({ order, page, size });
    return User.findAll(query);
  }

  getUser(id) {
    return User.findByPk(id);
  }

  removeUser(id) {
    return User.destroy({ where: { id } });
  }

  upsertUser(id, value) {
    return User.findByPk(id)
    .then(user => user && user.update(value) || User.create(value));
  }

};
