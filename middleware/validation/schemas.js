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

const username = {
  in: 'body',
  errorMessage: 'username must be 3-24 characters long (lowercase letters and/or digits)',
  matches: {
    options: Regex.username
  }, 
};

const password = {
  in: 'body',
  errorMessage: 'password must be 8-24 characters long (upper/lowercase letters, digits and/or special characters like `!`, `@`, `#`, etc.)',
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
    username,
    password,
  },
  UserData: {
    ...ContentType,
    username: {
      ...username,
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
  BodyFilename: {
    filename: {
      in: 'body',
      isArray: true,
    },
  },
  ParamFilename: {
    filename: {
      in: 'params',
      matches: {
        options: Regex.filename
      }
    }
  }
};
