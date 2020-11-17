'use strict';
const {
  CvDocument,
  Experience,
  CvExperience,
  Organization,
  Skill,
  CvSkill,
  SkillExperience,
} = require('../model');
const buildQuery = require('../utils/build-query');
const models = {
  Experience,
  Skill,
};

const indexNames = {
  CvDocument: 'cvDocumentId',
  Experience: 'experienceId',
  Skill: 'skillId',
};

function crudify(model, linkedModels = []) {
  const linkers = {};
  linkedModels.map(modelName => {
    const addFnName = `add${modelName}`;
    linkers[addFnName] = async (id, linkedItemId) => {
      const val = await model.findByPk(id);
      const linkedVal = await models[modelName].findByPk(linkedItemId);
      return val && val[addFnName] && linkedVal && val[addFnName](linkedVal);
    };
  });
  return {
    create: value => model.create(value),
    findOne: id => model.findByPk(id),
    findMany: ({ page, size, order }) => {
      const query = buildQuery({ page, size, order });
      return model.findAll(query);
    },
    update: async (id, value) => {
      const val = await model.findByPk(id);
      return val && val.update(value);
    },
    remove: id => model.destroy({ where: { id } }),
    ...linkers,
  };
}

function createLinker(model, { indexName, linkedIndexName }) {
  return {
    link: (id, linkedItemId) => model.create({
      [indexName]: id,
      [linkedIndexName]: linkedItemId,
    }),
    unlink: (id, linkedItemId) => model.destroy({ where: {
      [indexName]: id,
      [linkedIndexName]: linkedItemId,
    }}),
  };
}

module.exports = {
  cvDocument: crudify(CvDocument, ['Experience', 'Skill']),
  organization: crudify(Organization),
  skill: crudify(Skill),
  experience: crudify(Experience, ['Skill']),
  cvExperience: createLinker(CvExperience, {
    indexName: indexNames.CvDocument,
    linkedIndexName: indexNames.Experience,
  }),
  cvSkill: createLinker(CvSkill, {
    indexName: indexNames.CvDocument,
    linkedIndexName: indexNames.Skill,
  }),
  skillExperience: createLinker(SkillExperience, {
    indexName: indexNames.Skill,
    linkedIndexName: indexNames.Experience,
  }),
};
