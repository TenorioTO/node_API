const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const imageCounter = require('./controllers/image.counter');


const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'Tenorio',
        password: '123#321',
        database: 'nodeserver_db'
    }
});


app.use(bodyParser.json());
app.use(cors());



// start page
app.get('/', (req, res) => {
    db('users').select('*')
    .then(data => {
        if(data.length){
            res.json(data);
        } else {
            res.json('No user found');
        }
    })
    .catch(err => res.status(400).json('error tring to fetch users'));
});

//Signin route
app.post('/signin', (req, res) => {
    signin.handleSignIn(req, res, db, bcrypt)
});

//Register route
app.post('/register', (req, res) => {
    register.handleRegister(req, res, db, bcrypt, saltRounds)
});


//Profile userID
app.get('/profile/:id', (req, res) => {
    profile.handleProfile(req, res, db);
});

// Image counter
app.put('/image', (req, res) => {
    imageCounter.handleImageCounter(req, res, db);
});

app.listen(3000, () => {
    console.log('app is running on port 3000');
});