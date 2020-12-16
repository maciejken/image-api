const CrudService = require('../services/crud.service');
const { toCamelCase, uncapitalize } = require('../utils');

module.exports = class CrudController {
  service = null;
  linkedModels = [];
  identifier;

  constructor(model, linkedModels) {
    this.model = model;
    this.linkedModels = linkedModels;
    this.service = new CrudService(model, linkedModels);
    this.identifier = `${model.name}Id`;
    
    if (linkedModels) {
      for (const lm of linkedModels) {
        const ModelName = lm.model && toCamelCase(lm.model.name);
        const subIdentifier = `${uncapitalize(ModelName)}Id`;
        this[`create${ModelName}`] = async (req, res, next) => {
          try {
            const item = await this.service[`create${ModelName}`]
              (req.params[this.identifier], req.body);
            res.status(201).json(item);
          } catch (err) {
            next(err);
          }
        };
        this[`get${ModelName}`] = async (req, res, next) => {
          try {
            const item = await this.service[`get${ModelName}`]
              (req.params[this.identifier], req.params[subIdentifier]);
            res.status(200).json(item);
          } catch (err) {
            next(err);
          }
        };
        this[`get${ModelName}s`] = async (req, res, next) => {
          try {
            const items = await this.service[`get${ModelName}s`]
              .call(this.service, req.params[this.identifier]);
            res.status(200).json(items);
          } catch (err) {
            next(err);
          }
        };
        this[`update${ModelName}`] = async (req, res, next) => {
          try {
            const updatedItem = await this.service[`update${ModelName}`]
              (req.params[this.identifier], req.params[subIdentifier], req.body);
            res.status(200).json(updatedItem);
          } catch (err) {
            next(err);
          }
        };
        this[`remove${ModelName}`] = async (req, res, next) => {
          try {
            const result = await this.service[`remove${ModelName}`]
              (req.params[this.identifier], req.params[subIdentifier]);
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

  readMany = async (req, res, next) => {
    try {
      const { order, page, size } = req.query;
      const items = await this.service.readMany({ order, page, size });
      res.status(200).json(items);      
    } catch (err) {
      next(err);
    }  
  }

  readOne = async (req, res, next) => {
    try {
      const item = await this.service.readOne(req.params[this.identifier]);
      res.status(200).json(item);      
    } catch (err) {
      next(err);
    }
  }

  update = async (req, res, next) => {
    try {
      const updatedItem = await this.service.update(req.params[this.identifier], req.body);
      res.status(200).json(updatedItem);
    } catch (err) {
      next(err);
    }
  }

  destroy = async (req, res, next) => {
    try {
      const result = await this.service.destroy(req.params[this.identifier]);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

};
