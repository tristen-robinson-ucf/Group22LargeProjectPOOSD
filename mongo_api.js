

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});


// Ashers Database - main one 
const url = 'mongodb+srv://asher12353:COP4331-19thGroup@cluster0.vwkhdxi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url);
client.connect(console.log("mongodb connected"));

// Batmans Testing 
// const url = 'mongodb+srv://batman:0MYnNRWKo0Mchv9N@cluster0.r8ymchg.mongodb.net/';
// const MongoClient = require("mongodb").MongoClient;
// const client = new MongoClient(url);
// client.connect(console.log("mongodb connected"));


app.listen(5000); // start Node + Express server on port 5000


//REGISTER API
app.post('/api/register', async (req, res, next) =>
{
	// incoming: username, password, firstname, lastname
	// outgoing: username, password, firstname, lastname

	var error = '';

	const { username,password,firstname,lastname } = req.body;

	const db = client.db("COP4331_Group22");

	db.collection('Users').countDocuments().then(id =>
        {
            id++;
            //check if user exists
	        try{
		        db.collection('Users').insertOne( { id:id,username:username,password:password,firstname:firstname,lastname:lastname });
	        }
	        catch(e)
	        {
		        //User already exists
		        error = e.toString();
	        }
        });
	

	var ret = { error:error };
	res.status(200).json(ret);

});


//LOGIN API
app.post('/api/login', async (req, res, next) =>
{
	// incoming: username, password
	// outgoing: id, firstname, lastname, error

	var error = '';

	const { username,password } = req.body;

	const db = client.db("COP4331_Group22");
	const results = await db.collection('Users').find({username:username,password:password}).toArray();

	var id = -1;
	var fname = '';
	var lname = '';

	if(results.length > 0)
	{
		id = results[0].id
		fname = results[0].firstname
		lname = results[0].lastname
	}

	var ret = { id:id, firstname:fname, lastname:lname, error:error };
	res.status(200).json(ret);
	
});


// SEARCH API - Searches for users 
app.post('/api/search', async (req, res, next) => 
{
  // incoming: userId, search
  // outgoing: results[], error

  var error = '';

  const { userId, search } = req.body;

  var _search = search.trim();
  
  const db = client.db('COP4331_Group22');
  const results = await db.collection('Users').find({"username":{$regex:_search+'.*', $options:'i'}}).toArray();
  
  var _ret = [];
  for( var i=0; i<results.length; i++ )
  {
    _ret.push( results[i].username );
  }
  
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
});


