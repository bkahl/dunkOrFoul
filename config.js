/*global process*/
module.exports = {
  debug: process.env.DEBUG || false,
  connection_string: 'mongodb://localhost/things'
};