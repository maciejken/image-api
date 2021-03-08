module.exports = {
  getAccessToken(req) {
    const { authExpires, authorization } = { ...req.cookies, ...req.headers };
    return authExpires && authorization && authorization.replace('Bearer ', '');
  },
};
