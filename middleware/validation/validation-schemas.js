var { Regex } = require('../../enum');
var CustomValidator = require('./utils/custom-validator');

var BodyIsUser = {
  "content-type": {
    in: "headers",
    matches: {
      options: ["^application/json$", "i"]
    }
  },
  email: {
    in: "body",
    isEmail: true
  },
  role: {
    in: "body",
    errorMessage: "role parameter is restricted",
    isEmpty: true
  },
  password: {
    in: "body",
    errorMessage: 'password must be 6-24 characters long (upper/lowercase letters, digits or special characters like `!`, `@`, `#`, etc.)',
    matches: {
      options: Regex.password
    }
  }
};

var QueryCommon = {
  order: {
    in: "query",
    custom: {
      options: CustomValidator.maybeOrder
    },
    customSanitizer: {
      options: value => value || 'id asc'
    }
  },
  page: {
    in: "query",
    custom: {
      options: CustomValidator.maybePositiveInt
    },
    customSanitizer: {
      options: value => value || '1'
    }
  },
  size: {
    in: "query",
    custom: {
      options: CustomValidator.maybePositiveInt
    },
    customSanitizer: {
      options: value => value || '10'
    }
  }
};

module.exports = {
  BodyIsUser,
  QueryCommon
};
