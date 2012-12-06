var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var validatePresenceOf = function(value){
  return value && value.length; 
};

var toLower = function(string){
  return string.toLowerCase();
};
         
var User = new Schema({
  'username' : { type: String,
             validate : [validatePresenceOf, 'a name is required'],
             set: toLower  
           }
});

console.log('user schema loaded');
module.exports = mongoose.model('user', User);

// var mongoose = require('mongoose')
//   , Schema = mongoose.Schema;
// 
// var TaskSchema = new Schema({
//     itemName      : String
//   , itemCategory  : String
//   , itemCompleted : { type: Boolean, default: false }
//   , itemDate      : { type: Date, default: Date.now }
// });
// 
// module.exports = mongoose.model('TaskModel', TaskSchema);