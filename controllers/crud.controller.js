const CrudService = require('../services/crud.service');

module.exports = class CrudController {
  service;
  linkedModels;
  identifierKey;
  foreignKey;

  constructor(settings) {
    const { model, linkedModels, identifierKey, foreignKey } = settings;
    this.model = model;
    this.linkedModels = linkedModels;
    this.identifierKey = identifierKey || 'id';
    this.foreignKey = foreignKey;
    this.service = new CrudService(settings);
    
    if (linkedModels) {
      for (const lm of linkedModels) {
        const targetKey = lm.targetKey || 'id';
        const getParams = (req) => ({
          foreignKey: {
            name: this.foreignKey,
            value: req.params[this.identifierKey]
          },
          targetKey: {
            name: targetKey,
            value: req.params[lm.otherKey],
          },
          otherKey: {
            name: lm.otherKey,
            value: req.params[lm.otherKey],
          },
          value: req.body,
        });
        this[`create${lm.modelName}s`] = async (req, res, next) => {
          try {
            const params = getParams(req);
            if (Array.isArray(req.body)) {
              const data = await this.service[`create${lm.modelName}s`](params);
              res.status(201).json(data);
            } else {
              const [item, isNew] = await this.service[`create${lm.modelName}`](params);
              res.status(isNew ? 201 : 200).json(item);
            }
          } catch (err) {
            next(err);
          }
        };
        this[`get${lm.modelName}`] = async (req, res, next) => {
          try {
            const params = getParams(req);
            const item = await this.service[`get${lm.modelName}`](params);
            res.status(200).json(item);
          } catch (err) {
            next(err);
          }
        };
        this[`get${lm.modelName}s`] = async (req, res, next) => {
          try {
            const params = getParams(req);
            const items = await this.service[`get${lm.modelName}s`](params);
            res.status(200).json(items);
          } catch (err) {
            next(err);
          }
        };
        this[`update${lm.modelName}`] = async (req, res, next) => {
          try {
            const params = getParams(req);
            const updatedItem = await this.service[`update${lm.modelName}`](params);
            res.status(200).json(updatedItem);
          } catch (err) {
            next(err);
          }
        };
        this[`remove${lm.modelName}`] = async (req, res, next) => {
          try {
            const params = getParams(req);
            const result = await this.service[`remove${lm.modelName}`](params);
            res.status(200).json(result);
          } catch (err) {
            next(err);
          }
        };
      }
    }
  }

  create = async (req, res, next) => {
    try {
      const createdItem = await this.service.create(req.body);
      res.status(200).json(createdItem);
    } catch (err) {
      next(err);
    }
  }

  getMany = async (req, res, next) => {
    try {
      const { order, page, size } = req.query;
      const items = await this.service.getMany({ order, page, size });
      res.status(200).json(items);      
    } catch (err) {
      next(err);
    }  
  }

  getOne = async (req, res, next) => {
    try {
      const item = await this.service.getOne(req.params[this.identifierKey]);
      res.status(200).json(item);      
    } catch (err) {
      next(err);
    }
  }

  update = async (req, res, next) => {
    try {
      const updatedItem = await this.service.update(req.params[this.identifierKey], req.body);
      res.status(200).json(updatedItem);
    } catch (err) {
      next(err);
    }
  }

  remove = async (req, res, next) => {
    try {
      const result = await this.service.remove(req.params[this.identifierKey]);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

};
