const CrudService = require('../services/crud.service');

function CrudController(opts) {
  this.service = new CrudService(opts);
  this.linkedModels = opts.linkedModels;
}

CrudController.prototype.create = (req, res, next) => {
  try {
    const createdItem = await this.service.create(req.body);
    res.status(200).json(createdItem);
  } catch (err) {
    next(err);
  }
};

CrudController.prototype.readMany = (req, res, next) => {
  try {
    const { order, page, size } = req.query;
    const items = await this.service.readMany({ order, page, size });
    res.status(200).json(items);      
  } catch (err) {
    next(err);
  }  
};

CrudController.prototype.readOne = (req, res, next) => {
  try {
    const item = await this.service.readOne(req.params.id);
    res.status(200).json(item);      
  } catch (err) {
    next(err);
  }
};

CrudController.prototype.update = (req, res, next) => {
  try {
    const updatedItem = await this.service.update(req.params.id, req.body);
    res.status(200).json(updatedItem);
  } catch (err) {
    next(err);
  }
};

CrudController.prototype.destroy = (req, res, next) => {
  try {
    const result = await this.service.destroy(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

for (const m of this.linkedModels) {
  CrudController.prototype[`create${m.name}`] = (req, res, next) => {
    try {
      const item = await this.service[`create${m.name}`]
        (req.params.id, req.params[`${m.name}Id`]);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  };
  CrudController.prototype[`unlink${m.name}`] = (req, res, next) => {
    try {
      const result = await this.service[`unlink${m.name}`]
        (req.params.id, req.params[`${m.name}Id`]);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CrudController;
