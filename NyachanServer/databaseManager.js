var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ObjectId = require('mongodb').ObjectID;
var Dropbox = require('dropbox');
//http://dropbox.github.io/dropbox-sdk-js/Dropbox.html
var dbx = new Dropbox({ accessToken: 'RQ4xXaH3x-AAAAAAAAAADuWlSlvLuWi5Lef3ymzTNYzSNvQY2AwDOvqmVY73I41f' });

module.exports = function(app){

	// Connection URL
	var url = 'mongodb://alisson:123456@ds053206.mlab.com:53206/nyachan_data';

	app.get('/app/threads', function (req, res) {
		MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			console.log('Connection established to', url);
			db.collection('thread').find( { } ).toArray(function(error, documents) {
			    if (err){
			        throw error;
			    }
			    res.jsonp(documents);
			});

			db.close();
		  }
		});
	})


  app.get('/app/thread/:idThread', function (req, res) {
      MongoClient.connect(url, function(err, db) {
	        if (err) {
	        	console.log('Unable to connect to the mongoDB server. Error:', err);
	        } else {
		        console.log('Connection established to', url);
		        db.collection('thread').find( { _id: ObjectId(req.params.idThread)  } ).toArray(function(error, documents) {
		            if (err){
		                throw error;
		            }
		            res.jsonp(documents);
		        });

		        db.close();
	        }
	    });
	})

  app.get('/app/tag/:tagName', function (req, res) {
      MongoClient.connect(url, function(err, db) {
	        if (err) {
	        	console.log('Unable to connect to the mongoDB server. Error:', err);
	        } else {
		        console.log('Connection established to', url);
		        db.collection('thread').find( { tags: req.params.tagName} ).toArray(function(error, documents) {
		            if (err){
		                throw error;
		            }
		            res.jsonp(documents);
		        });

		        db.close();
	        }
	    });
	})

	app.put('/thread/newPost', function (req, res){
	    var newPost = req.body;
	    console.log(newPost);
	    MongoClient.connect(url, function(err, db) {
	        if (err) {
	        	console.log('Unable to connect to the mongoDB server. Error:', err);
	        } else {
		        console.log('Connection established to', url);

		        db.collection('thread', function(err, collection) {
		            collection.update({'_id': ObjectId(newPost.threadid)},{ $push: {post: newPost}}, {safe:true}, function(err, result) {
		                if (err) {
		                    console.log('Error ' + err);
		                    res.send({'error':'An error has occurred'});
		                } else {
		                    console.log('' + result);
		                    res.send(newPost);
		                }
		            });
		        });
		        db.close();
	        }
	    });
	})

	app.post('/thread/newThread', function (req, res){
	    var newThread = req.body;
	    console.log(newThread);
	    MongoClient.connect(url, function(err, db) {
	        if (err) {
	        	console.log('Unable to connect to the mongoDB server. Error:', err);
	        } else {
		        console.log('Connection established to', url);

		        db.collection('thread', function(err, collection) {
		            collection.insert({req.body}, {safe:true}, function(err, result) {
		                if (err) {
		                    console.log('Error ' + err);
		                    res.send({'error':'An error has occurred'});
		                } else {
		                    console.log('' + result);
		                    res.send(newThread);
		                }
		            });
		        });
		        db.close();
	        }
	    });
	})

}
