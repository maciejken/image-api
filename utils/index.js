function buildQuery({ order, page, size }) {
  order = order.split(',').map(o => o.split(' '));
  const offset = (page - 1) * size;
  const limit = offset + size;
  return { order, limit, offset };
};

function capitalize(word) {
  const W = word[0].toUpperCase();
  const ord = word.slice(1);
  return W + ord;  
}

function toCamelCase(text) {
  const words = text.split(/_|\s/);
  return words.map(capitalize).join('');
}

function uncapitalize(word) {
  const w = word[0].toLowerCase();
  const ord = word.slice(1);
  return w + ord;
}

module.exports = {
  buildQuery,
  toCamelCase,
  uncapitalize,
};
  