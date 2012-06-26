var DribbbleProxy     = require('../dribbble-proxy');

// articles per page
var limit;

// pagination middleware function sets some
// local view variables that any view can use
function pagination(req, res, next) {
    var page = parseInt(req.params.page) || 1,
        num = page * limit;
    db.articles.count(function(err, total) {
        res.local("total", total);
        res.local("pages", Math.ceil(total / limit));
        res.local("page", page);
        if (num < total) res.local("prev", true);
        if (num > limit) res.local("next", true);
        next();
    });
}