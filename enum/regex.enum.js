module.exports = {
    // patterns used in route definitions
    positiveInt: `[1-9]\\d{0,15}`,
    // user input (can use ^ for start, $ for end of string)
    order: `^[a-z_]{2,20}(\\s(asc|desc))?(,[a-z_]{2,20}(\\s(asc|desc))?)*$`,
    password: `^[A-Za-z0-9.,;:!?@#$%^&*]{6,24}$`,
    BasicAuth: `^Basic [A-Za-z0-9=/+]{10,100}$`,
    BearerAuth: `^Bearer \\S{150,160}$`,
    localAddress: `^(::1|::ffff:${process.env.LAN_ADDRESS}\\d{2})$`,
    groupName: `^[a-z-]{4,10}`,
  };