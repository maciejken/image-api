module.exports = function buildQuery({ order, page, size }) {
    order = order.split(',').map(o => o.split(' '));
    const offset = (page - 1) * size;
    const limit = offset + size;
    return { order, limit, offset };
  };
  