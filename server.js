const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');           
const PORT = process.env.PORT || 5000;  


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));

require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url);
client.connect(console.log("mongodb connected"));

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

//REGISTER API
app.post('/api/register', async (req, res, next) =>
{
	// incoming: username, password, firstname, lastname
	// outgoing: username, password, firstname, lastname, id, saved_parks
    // note: saved parks are start empty, later on when we have a multipage sign-up process we can send in the user's saved parks when registering.

	var error = '';
    var saved_parks = [];

	const { username,password,firstname,lastname } = req.body;

	const db = client.db("COP4331_Group22");

	db.collection('Users').countDocuments().then(id =>
    {
        id++;
	    //check if user exists
        try{
            db.collection('Users').insertOne( { id:id,username:username,password:password,firstname:firstname,lastname:lastname, saved_parks:saved_parks });
        }
        catch(e)
        {
            //User already exists
            error = e.toString();
        }

        var ret = { error:error };
        res.status(200).json(ret);

    });
	
});

if (process.env.NODE_ENV === 'production') 
{
     // Set static folder
    app.use(express.static('frontend/build'));

    app.get('*', (req, res) => 
    {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}


app.listen(PORT, () => 
{
  console.log('Server listening on port ' + PORT);
});