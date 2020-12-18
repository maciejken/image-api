const {
  Cv, CvDetail,
  Experience, ExperienceDetail,
  Group, GroupDetail,
  Image, ImageDetail,
  User, UserDetail, UserGroup,
} = require('../model');

module.exports = {
  pathToUploads: process.env.PATH_TO_UPLOADS,
  pathToThumbnails: process.env.PATH_TO_THUMBNAILS,
  CvSettings: {
    model: Cv,
    foreignKey: 'cvId',
    linkedModels: [
      {
        model: User,
        modelName: 'User',
        include: [
          {
            model: UserDetail,
            as: 'details',
          }
        ],
        eager: true,
        otherKey: 'userId',
      },
      {
        model: CvDetail,
        modelName: 'CvDetail',
        as: 'details',
        eager: true,
        otherKey: 'detailId',
      },
      {
        model: Experience,
        modelName: 'Experience',
        include: [
          { model: ExperienceDetail, as: 'details' }
        ],
        eager: true,
        otherKey: 'experienceId',
      },
    ]
  },
  ExperienceSettings: {
    model: Experience,
    foreignKey: 'experienceId',
    linkedModels: [
      {
        model: ExperienceDetail,
        modelName: 'ExperienceDetail',
        as: 'details',
        eager: true,
        otherKey: 'detailId',
      },
    ]
  },
  GroupSettings: {
    model: Group,
    foreignKey: 'groupId',
    linkedModels: [
      {
        model: GroupDetail,
        modelName: 'GroupDetail',
        as: 'details',
        eager: true,
        otherKey: 'detailId',
      },
    ]
  },
  ImageSettings: {
    identifierKey: 'filename',
    model: Image,
    foreignKey: 'filename',
    linkedModels: [
      {
        model: ImageDetail,
        modelName: 'ImageDetail',
        as: 'details',
        eager: true,
        otherKey: 'detailId',
      },
    ]
  },
  UserSettings: {
    model: User,
    foreignKey: 'userId',
    linkedModels: [
      {
        model: Group,
        modelName: 'Group',
        through: UserGroup,
        eager: true,
        otherKey: 'groupId',
      },
      {
        model: UserDetail,
        modelName: 'UserDetail',
        as: 'details',
        eager: true,
        otherKey: 'detailId',
      },
      {
        model: Cv,
        modelName: 'Cv',
        include: [
          {
            model: User,
            include: [
              { model: UserDetail, as: 'details' }
            ]
          },
          { model: CvDetail, as: 'details' },
          {
            model: Experience,
            include: [
              { model: ExperienceDetail, as: 'details' }
            ]
          }
        ],
        otherKey: 'cvId',
      },
    ]
  },
};
