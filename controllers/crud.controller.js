'use strict';

const CrudService = require('../services/crud.service');

class CrudController {
  // linkedModels;
  // identifierKey;
  // foreignKey;
  // service;
  // filters;

  constructor(settings) {
    this.linkedModels = settings.linkedModels || [];
    this.identifierKey = settings.identifierKey || 'id';
    this.foreignKey = settings.foreignKey;
    this.service = new CrudService(settings);
    this.filters = settings.filters;
    this.create = async (req, res, next) => {
      try {
        const createdItem = await this.service.create(req.body);
        res.status(200).json(createdItem);
      } catch (err) {
        next(err);
      }
    };
    this.getMany = async (req, res, next) => {
      try {
        const { order, page, size } = req.query;
        let filters;
        if (this.filters) {
          filters = this.filters.map(f => f(req, res));
        }
        const items = await this.service.getMany({ order, page, size, filters });
        res.status(200).json(items);      
      } catch (err) {
        next(err);
      }  
    };
    this.getOne = async (req, res, next) => {
      try {
        const item = await this.service.getOne(req.params[this.identifierKey]);
        res.status(200).json(item);      
      } catch (err) {
        next(err);
      }
    };
    this.update = async (req, res, next) => {
      try {
        const updatedItem = await this.service.update(req.params[this.identifierKey], req.body);
        res.status(200).json(updatedItem);
      } catch (err) {
        next(err);
      }
    };
    this.remove = async (req, res, next) => {
      try {
        const result = await this.service.remove(req.params[this.identifierKey]);
        res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    };
    generateLinkedModelMethods(this, settings.linkedModels);
  }

}

function generateLinkedModelMethods(ctx, linkedModels) {
  for (const lm of linkedModels) {
    const targetKey = lm.targetKey || 'id';
    const getParams = (req) => ({
      foreignKey: {
        name: ctx.foreignKey,
        value: req.params[ctx.identifierKey]
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
    ctx[`create${lm.modelName}s`] = async (req, res, next) => {
      try {
        const params = getParams(req);
        if (Array.isArray(req.body)) {
          const data = await ctx.service[`create${lm.modelName}s`](params);
          res.status(201).json(data);
        } else {
          const [item, isNew] = await ctx.service[`create${lm.modelName}`](params);
          res.status(isNew ? 201 : 200).json(item);
        }
      } catch (err) {
        next(err);
      }
    };
    ctx[`get${lm.modelName}`] = async (req, res, next) => {
      try {
        const params = getParams(req);
        const item = await ctx.service[`get${lm.modelName}`](params);
        res.status(200).json(item);
      } catch (err) {
        next(err);
      }
    };
    ctx[`get${lm.modelName}s`] = async (req, res, next) => {
      try {
        const params = getParams(req);
        const items = await ctx.service[`get${lm.modelName}s`](params);
        res.status(200).json(items);
      } catch (err) {
        next(err);
      }
    };
    ctx[`update${lm.modelName}`] = async (req, res, next) => {
      try {
        const params = getParams(req);
        const updatedItem = await ctx.service[`update${lm.modelName}`](params);
        res.status(200).json(updatedItem);
      } catch (err) {
        next(err);
      }
    };
    ctx[`remove${lm.modelName}`] = async (req, res, next) => {
      try {
        const params = getParams(req);
        const result = await ctx.service[`remove${lm.modelName}`](params);
        res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    };
  }
}

module.exports = CrudController;
