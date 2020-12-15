function buildQuery({ order, page, size }) {
  order = order.split(',').map(o => o.split(' '));
  const offset = (page - 1) * size;
  const limit = offset + size;
  return { order, limit, offset };
};

function toTitleCase(word) {
  const W = word[0].toUpperCase();
  const ord = word.slice(1);
  return W + ord;  
}

module.exports = {
  buildQuery,
  toTitleCase,
};
  