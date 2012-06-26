var mongoose = require('mongoose');

module.exports = function(config, Model) {
  var connection_string = config.connection_string;
  mongoose.connect(connection_string);
  console.log('mongoose connected  to : ',connection_string);

  return {
    
    get_object_id: function(id) {
      if (typeof(id) === 'string') return mongoose.Types.ObjectId(id);
      return id;
    },

    find_by_id: function(id, callback) {
      Model.findById(id, callback);
    },

    find_one: function(query, callback) {
      Model.findOne(query, callback);
    },

    find_many: function(query, callback) {
      Model.find(query, callback);
    },

    save: function(doc, callback) {
      var document = doc._id ? doc : new Model(doc);
      document.save(function(err){
        if (err) callback(err);
        else callback(null, document);
      });
    },

    remove: function(id, callback) {
      Model.findById(id, function(err, document) {
        if (err) return callback(err);
        document.remove();
        callback(null, null);
      });
    }

  };
};