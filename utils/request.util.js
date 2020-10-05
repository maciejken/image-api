module.exports = {
  getAccessToken(req) {
    const { authorization, authorized } = { ...req.cookies, ...req.headers };
    return authorized && authorization && authorization.replace('Bearer ', '');
  },
};
