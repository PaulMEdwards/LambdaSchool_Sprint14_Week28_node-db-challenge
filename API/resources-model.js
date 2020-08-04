const db = require('../data/dbConfig.js');

module.exports = {
  getResources,
  getResourceById,
  addResource,
  updateResource,
  removeResource
};

function getResources() {
  return db("resources");
};

function getResourceById(resource_id) {
  if (resource_id) {
    return db("resources")
      .where("id", resource_id)
      .first();
  } else {
    return null;
  }
};

function addResource(resource) {
  return db("resources")
    .insert(resource)
    .then(ids => this.getResourceById(ids[0]));
};

function updateResource(resource_id, changes) {
  return db("resources")
    .where("id", resource_id)
    .update(changes)
    .then(count => (count > 0 ? this.getResourceById(resource_id) : null));
};

function removeResource(resource_id) {
  if (resource_id) {
    return db("resources")
      .where("id", resource_id)
      .del();
  } else {
    return null;
  }
};
