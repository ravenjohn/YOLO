var config = require(__dirname + '/../config/config'),
    logger = require(__dirname + '/../lib/logger'),
    util = require(__dirname + '/../helpers/util'),
    db = require(__dirname + '/../lib/mongodb');

exports.login = function (req, res, next) {
	var data = req.body;
	db.get().collection('users', function (err, collection) {
		if (err) return next(err);
		collection.find({_id : data.number, password : data.password}).toArray(function (err, docs) {
			if (err)
				return next(err);
			if (docs.length > 0)
				return res.send(200, {message : 'Login successful'});
			res.send(400, {message : 'Login failed'});
		});
	});
};

exports.register = function (req, res, next) {
	var data = req.body;
	data._id = data.number;
	data.password = util.randomString(8);
	delete data.number;
	db.get().collection('users', function (err, collection) {
		if (err) return next(err);
		collection.insert(data, function (err) {
			if (err) return next(err);
			res.send(200, {
				username : data._id,
				password : data.password
			});
		});
	});
};


exports.update = function (req, res, next) {
	var data = req.body,
		id = data.number;
	delete data.number;
	db.get().collection('users', function (err, collection) {
		if (err) return next(err);
		collection.update({_id : id}, {$set : data}, function (err) {
			if (err) return next(err);
			res.send(200, {message : 'Update successful'});
		});
	});
};