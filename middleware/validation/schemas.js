const { Regex } = require('../../enum');
const CustomValidator = require('./utils/custom-validator');

const ContentType = {
  'content-type': {
    in: 'headers',
    matches: {
      options: ['^application/json$', 'i']
    }
  },
};

const email = {
  in: 'body',
  isEmail: true  
};

const password = {
  in: 'body',
  errorMessage: 'password must be 6-24 characters long (upper/lowercase letters, digits or special characters like `!`, `@`, `#`, etc.)',
  matches: {
    options: Regex.password
  },
};

const name = {
  in: 'body',
  errorMessage: 'name must be 4-10 characters long',
  matches: {
    options: Regex.groupName
  },
}

module.exports = {
  NewUserData: {
    ...ContentType,
    email,
    password,
  },
  UserData: {
    ...ContentType,
    email: {
      ...email,
      optional: true,
    },
    password: {
      ...password,
      optional: true,
    },
  },
  NewGroupData: {
    ...ContentType,
    name,
  },
  GroupData: {
    ...ContentType,
    name: {
      ...name,
      optional: true,
    },
  },
  QueryCommon: {
    order: {
      in: 'query',
      custom: {
        options: CustomValidator.isOrder
      },
      customSanitizer: {
        options: value => value || 'createdAt desc'
      }
    },
    page: {
      in: 'query',
      custom: {
        options: CustomValidator.isPositiveInt
      },
      customSanitizer: {
        options: value => value || '1'
      }
    },
    size: {
      in: 'query',
      custom: {
        options: CustomValidator.isPositiveInt
      },
      customSanitizer: {
        options: value => value || '10'
      }
    }
  },
  NewImageData: {},
  ImageData: {},
  UploadQuery: {
    groupId: {
      in: 'query',
      isInt: {
        options: { min: 1, max: 100 }
      }
    }
  }
};
