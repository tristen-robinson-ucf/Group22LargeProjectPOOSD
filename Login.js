//Katelyn - this is for testing it locally
/*const url = 'mongodb+srv://asher12353:COP4331-19thGroup@cluster0.vwkhdxi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url);
client.connect(console.log("mongodb connected"));*/

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
