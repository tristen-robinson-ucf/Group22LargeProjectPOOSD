const {MongoClient} = require('mongodb');
const request = require('supertest');
//const { app } = require('../server');
const app = 'https://group-22-0b4387ea5ed6.herokuapp.com';

const url = 'mongodb+srv://asher12353:COP4331-19thGroup@cluster0.vwkhdxi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const group = 'COP4331_Group22';


describe('API Endpoint Tests', () => {
    let connection;
    let db;
  
    beforeAll(async () => {
      connection = await MongoClient.connect(url);
      db = await connection.db(group);
    });
  
    afterAll(async () => {
      await connection.close();
    });
  
    it('Register - should create a new user', async () => {
      const res = await request(app)
      .post('/api/register')
      .send({
        username: "COPisFUN",
        password: 'COP4331',
        firstname: "Rick",
        lastname: "Lein",
        email: "rick@gmail.com",
        phone: "9875468763"
      });

      const user = db.collection('Users');

      const insertedUser = await user.findOne({ username: 'COPisFUN' });
      expect(insertedUser);
      expect(res.status).toBe(200);
    });

    it('DeleteUser - should delete user', async () => {
      const res = await request(app).get('/api/deleteUser');

      const user = db.collection('Users');
      const deleteUser = db.collection('Users').deleteOne({ username: 'COPisFUN' });

      const search = await user.findOne({ username: 'COPisFUN' });
      expect(search).toBeNull();
      expect(res.status).toBe(200);

    });

    it('Login - should login a user', async () => {
      const res = await request(app).get('/api/login');

      const user = db.collection('Users');
      const login = await user.findOne({ username: 'RickL' });

      expect(login).toBeDefined();
      expect(res.status).toBe(200);

    });

  });