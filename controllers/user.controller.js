var userService = require("../services/user.service");

var upsertUser = (id) => (req, res, next) => {
  const { email, password } = req.body;
  userService.upsertUser(id, { email, password })
    .then(user => {
      res.status(200).json(user);
    })
    .catch(next);
}

module.exports = {
  getUsers: (req, res, next) => {
    const { order, page, size } = req.query;
    userService.getUsers({ order, page, size })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(next);
  },

  getUser: (req, res, next) => {
    userService.getUser(req.params.id)
      .then(user => {
        res.status(200).json(user);
      })
      .catch(next);
  },

  createUser: (req, res, next) => {
    upsertUser()(req, res, next);
  },

  updateUser: (req, res, next) => {
    upsertUser(req.params.id)(req, res, next);
  },

  removeUser: (req, res, next) => {
    userService.removeUser(req.params.id)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(next);
  }

};
