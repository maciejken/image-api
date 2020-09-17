const { Regex } = require('../../enum');
const CustomValidator = require('./utils/custom-validator');
const CustomError = require('../errors/custom-error');

const ContentType = {
  "content-type": {
    in: "headers",
    matches: {
      options: ["^application/json$", "i"]
    }
  },
};

const email = {
  in: "body",
  isEmail: true  
};

const password = {
  in: "body",
  errorMessage: 'password must be 6-24 characters long (upper/lowercase letters, digits or special characters like `!`, `@`, `#`, etc.)',
  matches: {
    options: Regex.password
  },
};

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
  QueryCommon: {
    order: {
      in: "query",
      custom: {
        options: CustomValidator.isOrder
      },
      customSanitizer: {
        options: value => value || 'id asc'
      }
    },
    page: {
      in: "query",
      custom: {
        options: CustomValidator.isPositiveInt
      },
      customSanitizer: {
        options: value => value || '1'
      }
    },
    size: {
      in: "query",
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
};
