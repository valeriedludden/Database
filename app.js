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
});

const user = mongoose.model('userCollection', userSchema);

app.get('/', (req, res)=>{
    res.redirect('/users');
});

app.get('/users', (req, res) => {
    user.find({}, (err, data)=> {
        res.render('users', {userArray : data})
    });
});

app.post('/searchResult/', (req, res) => {
    let search = req.body.searchFirst;
    console.log(`search ${search}`);
    let found;
    user.findOne({first: search}, (err, data) => {
        if (err) return console.log(`Oops! ${err}`);
        found = data;
        res.render('searchResult', {user: found})
    });

});

app.get('/users/up', (req, res)=>{
    user.find({}).sort({first: 1}).exec( (err, data) =>{
        if (err) {
            return console.error(err);
        }

        res.render('users', {userArray: data})
    })
});

app.get('/users/down', (req, res)=>{
    user.find({}).sort({first: -1}).exec( (err, data) =>{
        if (err) {
            return console.error(err);
        }

        res.render('users', {userArray: data})
    })
});

app.get('/addUser', (req, res)=>{
    res.render('addUser')
});

app.post('/addUser', (req, res) => {
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

app.get('/edit/:id', (req, res) => {
    let userId = req.params.id;
    console.log(`user Id ${userId}`);
    user.findOne({ _id: userId }, (err, data) => {
        if (err) return console.log(`Oops! ${err}`);
        console.log(`data -- ${JSON.stringify(data)}`);
        let editUser = {
            _id: userId,
            first: data.first,
            last: data.last,
            email: data.email,
            age: data.age
        };
        console.log('editUser ' + editUser);
        res.render('edit', {editUser: editUser});
    });
});

app.post('/edit/:id', (req, res) => {

    let id = req.params.id;
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let age = req.body.age;
    user.findOneAndUpdate({_id: id},
        {first: first,
            last: last,
            email: email,
            age: age},
        {new : true },
            (err, data) =>{
        if (err) return console.log(`Oops! ${err}`);
        res.redirect('/users');

    })

});

app.get('/delete/:id', (req, res) => {
    let deleteUser = req.params.id;
    console.log("delete " + deleteUser);
    user.findOneAndDelete({_id: deleteUser}, (err, data) => {
        if (err) {
            return console.error(err);
        }
        res.redirect('/users')
    })
});

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`App Server listen on port: ${port}`);
});