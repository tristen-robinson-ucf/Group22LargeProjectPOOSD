//Katelyn: this is for testing it locally
/*const url = 'mongodb+srv://asher12353:COP4331-19thGroup@cluster0.vwkhdxi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url);
client.connect(console.log("mongodb connected"));*/

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
