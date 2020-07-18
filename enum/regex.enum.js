module.exports = {
    // patterns used in route definitions
    positiveInt: `[1-9]\\d{0,15}`,
    // user input (can use ^ for start, $ for end of string)
    order: `^[a-z_]{2,20}(\\s(asc|desc))?(,[a-z_]{2,20}(\\s(asc|desc))?)*$`,
    password: `^[A-Za-z0-9.,;:!?@#$%^&*]{6,24}$`
  };