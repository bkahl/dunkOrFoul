var config     = require('../config'),
    User       = require('../models/user'),
    Repository = require('./repository'),
    repository = new Repository(config, User);

module.exports = {

  find_by_id: function(id, callback) {
    var object_id = repository.get_object_id(id);
    var query = { _id: object_id };
    repository.find_one(query, callback);
  },

  save: function(user, callback) {
    repository.save(user, function(err, user) {
      if (err) return callback(err);
      callback(null, user);
    });
  },

  remove: function(id, callback) {
    repository.remove(id, callback);
  }

};