module.exports = {
  getAccessToken(req) {
    const { authExpiration, authorization } = { ...req.cookies, ...req.headers };
    return authExpiration && authorization && authorization.replace('Bearer ', '');
  },
};
