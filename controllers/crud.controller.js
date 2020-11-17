const crudServiceWrapper = require('../services/crud.service');

module.exports = (type) => ({
  async getMany(req, res, next) {
    try {
      const { order, page, size } = req.query;
      const items = await crudServiceWrapper[type].findMany({ order, page, size });
      res.status(200).json(items);      
    } catch (err) {
      next(err);
    }
  },
  async getOne(req, res, next) {
    try {
      const item = await crudServiceWrapper[type].findOne(req.params.id);
      res.status(200).json(item);      
    } catch (err) {
      next(err);
    }
  },
  async create(req, res, next) {
    try {
      const createdItem = await crudServiceWrapper[type].create(req.body);
      res.status(200).json(createdItem);
    } catch (err) {
      next(err);
    }
  },
  async update(req, res, next) {
    try {
      const updatedItem = await crudServiceWrapper[type].update(req.params.id, req.body);
      res.status(200).json(updatedItem);
    } catch (err) {
      next(err);
    }
  },
  async remove(req, res, next) {
    try {
      const result = await crudServiceWrapper[type].remove(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
});
