const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require('path');

const mongoose = require('mongoose');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


mongoose.connect('mongodb://localhost/userManagement',
    {useNewUrlParser: true}); // "userManagement" is the db name

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('db connected');
});

const userSchema = new mongoose.Schema({
    first: String,
    last: String,
    email: String,
    age: { type: Number, min: 1, max: 125},
    // createdDate: { type: Date, default: Date.now }
});

const user = mongoose.model('userCollection', userSchema);

app.post('/edit', (req, res) => {
    console.log(`POST /newUser: ${JSON.stringify(req.body)}`);
    const newUser = new user();
    newUser.first = req.body.first;
    newUser.last = req.body.last;
    newUser.email = req.body.email;
    newUser.age = req.body.age;
    newUser.save((err, data) => {
        if (err) {
            return console.error(err);
        }
        res.send(`done ${data}`);
    });
});

app.post('/updateUser', (req, res) => {
    console.log(`POST /updateUserRole: ${JSON.stringify(req.body)}`);
    let matchedName = req.body.first + req.body.last;
    let editedUser = req.body.role;
    user.findOneAndUpdate( {name: matchedName}, {user: editedUser},
        { new: true },
        (err, data) => {
            if (err) return console.log(`Oops! ${err}`);
            console.log(`data -- ${data.editedUser}`);
            let returnMsg = `user name : ${name} Updated User : ${data.editedUser}`;
            console.log(returnMsg);
            res.send(returnMsg);
        });
});
app.get('/', (req, res)=>{
    res.redirect('/users');
});
app.get('/addUser', (req, res)=>{
    res.render('addUser')
});

app.post('/addUser', (req, res) => {
    // console.log(`POST /newUser: ${JSON.stringify(req.body)}`);
    const newUser = new user();
    newUser.first = req.body.first;
    newUser.last = req.body.last;
    newUser.email = req.body.email;
    newUser.age = req.body.age;
    newUser.save((err, data) => {
        if (err) {
            return console.error(err);
        }
        res.redirect('/users');
    });
});


app.get('/users', (req, res) => {
   user.find({}, (err, data)=> {
       res.render('users', {userArray : data})
   });
});

// app.get('/users/:name', (req, res) => {
//     let userName = req.params.name;
//     console.log(`GET /users/:name: ${JSON.stringify(req.params)}`);
//     user.findOne({ name: userName }, (err, data) => {
//         if (err) return console.log(`Oops! ${err}`);
//         console.log(`data -- ${JSON.stringify(data)}`);
//         let returnMsg = `user name : ${userName} role : ${data.role}`;
//         console.log(returnMsg);
//         res.send(returnMsg);
//     }); });


app.get('/users/:name', (req, res) => {
    let userName = req.params.name;
    console.log(`GET /users/:name: ${JSON.stringify(req.params)}`);
    user.findOne({ name: userName }, (err, data) => {
        if (err) return console.log(`Oops! ${err}`);
        console.log(`data -- ${JSON.stringify(data)}`);
        let returnMsg = `user name : ${userName} role : ${data.role}`;
        console.log(returnMsg);
        res.send(returnMsg);
    }); });


app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`App Server listen on port: ${port}`);
});