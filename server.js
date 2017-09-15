var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var Bear = require('./app/models/bear')
//configure the app to use body parser
//this will allow us to get the data from a POST

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

//Routes for the API

var router = express.Router();

router.use(function(req, res, next){
	console.log('Fire walk with me');
	next();
})

router.get('/', function(req, res){
	res.json({message: 'Hello, API!'})
})

router.route('/bears')
	.post(function(req, res){
		var bear = new Bear();
		bear.name = req.body.name;
		
		console.log(bear);
		console.log(req.body);

		bear.save(function(err){
			if(err)
				res.send(err);
			res.json({message: 'Bear created!'});
		});
	})
// get all the bears (accessed at GET 
	.get(function(req, res){
		Bear.find(function(err,bears){
			if(err){
 				res.send(err);
			}	
			res.json(bears)
		})
	});

router.route('/bears/:bear_id')
	.get(function(req, res){
		Bear.findById(req.params.bear_id, function(err, bear){
			if(err) res.send(err);
			res.json(bear);
		});
	});

//preface all with the api/ route
app.use('/api', router);

mongoose.connect('mongodb://localhost/bears');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log('DB is up!');
});

app.listen(port)
console.log('Up on port ' + port);
