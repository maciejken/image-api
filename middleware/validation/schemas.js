const { Regex } = require('../../enum');
const CustomValidator = require('./utils/custom-validator');
const AuthService = require('../../services/auth.service');
const UserService = require('../../services/user.service');
const StatusCodeError = require('../errors/status-code-error');

const BasicAuthHeader = {
  Authorization: {
    in: 'headers',
    custom: {
      options: (value, { res }) => {
        if (!/^Basic [A-Za-z0-9=/+]{10,100}$/.test(value)) {
          res.set('WWW-Authenticate', 'Basic');
          throw new StatusCodeError(`unauthorized`, 401);
        }
        return true;
      }
    }
  }
};

const BearerAuthHeader = {
  Authorization: {
    in: 'headers',
    custom: {
      options: (value, { res }) => {
        if (!/^Bearer \S{10,1000}$/.test(value)) {
          res.set('WWW-Authenticate', 'Bearer');
          throw new StatusCodeError(`unauthorized`, 401);
        }
        return true;
      }
    }
  }
};

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

const NewUserData = {
  ...ContentType,
  email,
  password,
};

const UserData = {
  ...ContentType,
  email: {
    ...email,
    optional: true,
  },
  password: {
    ...password,
    optional: true,
  },
};

const QueryCommon = {
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

const UserIsAdmin = {
  Authorization: {
    in: 'headers',
    custom: {
      options: async value => {
        if (value && value.split(' ').length === 2) {
          const [authType, token] = value.split(' ');
          const jwt = new AuthService().verifyIdToken(token);
          const user = await new UserService().getUser(jwt.sub);
          if (!user) {
            throw new StatusCodeError(`user ${jwt.sub} not found`, 400);
          }
          if (user.id !== process.env.ADMIN_ID) {
            throw new StatusCodeError(`user ${jwt.sub} is not an admin`, 400);
          }
        }
        return true;
      }
    },
  }
};

module.exports = {
  BasicAuthHeader,
  BearerAuthHeader,
  NewUserData,
  UserData,
  QueryCommon,
  UserIsAdmin,
  UserCanViewProfile,
  UserCanEditProfile,
  UserCanAddImages,
  UserCanViewImage,
  UserCanEditImage,
};
