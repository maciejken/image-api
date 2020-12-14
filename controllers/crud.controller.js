const CrudService = require('../services/crud.service');

module.exports = class CrudController {
  name = '';
  service = null;
  linkedModels = [];

  constructor(model, linkedModels) {
    this.model = model;
    this.linkedModels = linkedModels;
    this.service = new CrudService(model, linkedModels);
    
    if (linkedModels) {
      for (const lm of linkedModels) {
        const [m, ...odelName] = lm.model.name;
        const ModelName = `${m.toUpperCase()}${odelName.join('')}`;
        this[`create${ModelName}`] = async (req, res, next) => {
          try {
            const item = await this.service[`create${ModelName}`]
              (req.params.id, req.params[`${lm.model.name}Id`]);
            res.status(201).json(item);
          } catch (err) {
            next(err);
          }
        };
        this[`remove${ModelName}`] = async (req, res, next) => {
          try {
            const result = await this.service[`remove${ModelName}`]
              (req.params.id, req.params[`${lm.model.name}Id`]);
            res.status(200).json(result);
          } catch (err) {
            next(err);
          }
        }
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
      const item = await this.service.readOne(req.params.id);
      res.status(200).json(item);      
    } catch (err) {
      next(err);
    }
  }

  update = async (req, res, next) => {
    try {
      const updatedItem = await this.service.update(req.params.id, req.body);
      res.status(200).json(updatedItem);
    } catch (err) {
      next(err);
    }
  }

  destroy = async (req, res, next) => {
    try {
      const result = await this.service.destroy(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

};
