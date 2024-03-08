

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
	// incoming: username, password, firstname, lastname, email, phone
	// outgoing: error

	var error = '';
	var saved_parks = [];

	const { username,password,firstname,lastname,email,phone } = req.body;

	const db = client.db("COP4331_Group22");

	db.collection('Users').countDocuments().then(id =>
        {
            id++;
            //check if user exists
	        try{
		        db.collection('Users').insertOne( { id:id,username:username,password:password,firstname:firstname,lastname:lastname,email:email,phone:phone,saved_parks:saved_parks });
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

//DELETE USER API - if we wanted to have the ability for a user to cancel their account
// need to be tested
app.post('/api/deleteUser', async (req, res, next) =>
{
	// incoming: username
	// outgoing: message, error

	var error = '';
	var message = 'User has been deleted';

	//deletes with username - should have different usernames (change register if needed later)
	const { username } = req.body;

	const db = client.db("COP4331_Group22");

	try{
		db.collection('Users').deleteOne({ username:username });
	}
	catch(e){
		error = e.toString();
	}

	var ret = { message:message, error:error };
	res.status(200).json(ret);
});

//UPDATE USER API - might not need but just in case (not including saved_parks)
// need to be tested
app.post('/api/updateUser', async (req, res, next) =>
{
	// incoming: id, username, password, firstname, lastname, email, phone - using this for now (not sure how we will do it)
	// outgoing: message, error

	var error = '';
	var message = 'User has been updated';

	const { username, password, firstname, lastname, email, phone } = req.body;

	const db = client.db("COP4331_Group22");

	// searches by id and updates every field in Users
	try{
		db.collection('Users').updateOne({id:id}, {$set: { username:username, password:password, firstname:firstname, lastname:lastname, email:email, phone:phone }});
	}
	catch(e){
		error = e.toString();
	}

	var ret = { message:message,error:error };
	res.status(200).json(ret);
});


// SEARCH USER API - Searches for users 
// need to be tested
app.post('/api/searchUser', async (req, res, next) => 
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

// ADD TRIP API - Adds a trip
// need to test
app.post('/api/addTrip', async (req, res, next) =>
{
	// incoming: name, startDate, endDate, userID
	// outgoing: error

	var error = '';
	var rides = [];

	const { name,startDate,endDate,userID } = req.body;

	const db = client.db('COP4331_Group22');

	db.collection('Trips').countDocuments().then(id =>
        {
            id++;
            //check if trip exists
	        try{
		        db.collection('Trips').insertOne( { id:id,name:name,startDate:startDate,endDate:endDate,userID:userID,rides:rides });
	        }
	        catch(e)
	        {
			// trip already exists
			error = e.toString();
	        }
        });
	
	var ret = { error:error };
	res.status(200).json(ret);
});

// DELETE TRIP API - deletes a trip
// need to test
app.post('/api/deleteTrip', async (req, res, next) =>
{
	// incoming: name
	// outgoing: message, error

	var error = '';
	var message = 'Trip has been deleted';

	//deletes with name - should have different trip names
	const { name } = req.body;

	const db = client.db("COP4331_Group22");

	try{
		db.collection('Trips').deleteOne({ name:name });
	}
	catch(e){
		error = e.toString();
	}

	var ret = { message:message, error:error };
	res.status(200).json(ret);
});

// SEARCH TRIP API - searches for a trip by name
// need to test
app.post('/api/searchTrip', async (req, res, next) =>
{
	// incoming: userID, search
	// outgoing: results[], error

	var error = '';

	const { userID, search } = req.body;
	
	var _search = search.trim();
	  
	const db = client.db('COP4331_Group22');
	const results = await db.collection('Trips').find({"name":{$regex:_search+'.*', $options:'i'}}).toArray();
	  
	var _ret = [];
	for( var i=0; i<results.length; i++ )
	{
		_ret.push( results[i].name );
	}
	  
	var ret = {results:_ret, error:error};
	res.status(200).json(ret);
});

// UPDATE TRIP API - updates a trip
// need to test
app.post('/api/updateTrip', async (req, res, next) =>
{
	// incoming: id, name, startDate, endDate - using this for now (not sure how we will do it)
	// outgoing: message, error

	var error = '';
	var message = 'Trip has been updated';

	const { name,startDate,endDate } = req.body;

	const db = client.db("COP4331_Group22");

	// searches by id and updates every field in Trips
	try{
		db.collection('Trips').updateOne({id:id}, {$set: { name:name, startDate:startDate, endDate:endDate }});
	}
	catch(e){
		error = e.toString();
	}

	var ret = { message:message,error:error };
	res.status(200).json(ret);
});
