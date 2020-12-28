function buildQuery({ order, page, size, filters }) {
  let query = {};
  if (order) {
    query.order = order.split(',').map(o => o.split(' '));;
  }
  if (page && size) {
    const offset = (page - 1) * size;
    query.offset = offset;
    query.limit = offset + size;
  }
  if (filters) {
    query.where = {};
    filters.forEach(f => {
      query.where[f.attribute] = f.value
    });
  }
  return query;
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
  