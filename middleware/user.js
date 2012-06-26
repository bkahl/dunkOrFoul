var user = require('../repositories/user');

module.exports = function(req, res, next, id) {
  user.find_by_id(id, function(err, user) {
    if (err) return next(err);
    if (user === null) return res.send("user not found", 404);
    req.user = user;
    next();
  });
};