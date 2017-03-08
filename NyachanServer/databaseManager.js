var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ObjectId = require('mongodb').ObjectID;

module.exports = function(app){
	
	// Connection URL 
	var url = 'mongodb://alisson:123456@ds053206.mlab.com:53206/nyachan_data';

	app.get('/a/threads', function (req, res) {
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

	app.get('/a/thread/1', function (req, res) {
	    MongoClient.connect(url, function(err, db) {
	        if (err) {
	        	console.log('Unable to connect to the mongoDB server. Error:', err);
	        } else {
		        console.log('Connection established to', url);
		        db.collection('thread').find( { _id: ObjectId("57fb3a3bdcba0f6a8b60f17a")  } ).toArray(function(error, documents) {
		            if (err){
		                throw error;
		            }
		            res.jsonp(documents);
		        });
		            
		        db.close();
	        }
	    });
	})

	app.get('/a/thread/2', function (req, res) {
	    MongoClient.connect(url, function(err, db) {
	        if (err) {
	        	console.log('Unable to connect to the mongoDB server. Error:', err);
	        } else {
		        console.log('Connection established to', url);
		        db.collection('thread').find( { _id: ObjectId("57fb3ac1dcba0f6a8b60f197")  } ).toArray(function(error, documents) {
		            if (err){
		                throw error;
		            }
		            res.jsonp(documents);
		        });
		            
		        db.close();
	        }
	    });
	})

	app.put('/a/thread/newPost', function (req, res){
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

}