const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createLookup = (array, key, value) => {
  return array.reduce((lookup, item) => {
    if (item[key] && item[value]) {
      lookup[item[key]] = item[value];
    }
    return lookup;
  }, {});
};
