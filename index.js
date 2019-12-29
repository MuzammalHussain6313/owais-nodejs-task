const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/owaisTable', {useNewUrlParser: true}, ()=>console.log('connected'));

mongoose.connect('mongodb+srv://owais:khattak.com@cluster0-cy7f9.mongodb.net/madDB?retryWrites=true&w=majority',
                 {useNewUrlParser: true},
    ()=>console.log('connected'));
const User = mongoose.model('User', {
    name: String,
    username: String,
    email: String,
    password: String
});
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.send('hello world Application');
});

app.post('/login', async (req, res) => {
    const body = req.body;
    console.log('req.body', body);
    const email = body.email;
    // lets check if email exists
    const result = await Student.findOne({"email": email});
    if (!result) // this means result is null
    {
        res.status(401).send({
            Error: 'This user doesnot exists. Please signup first'
        });
    } else {
        // email did exist
        // so lets match password
        if (body.password === result.password) {
            // great, allow this user access
            console.log('match');
            res.send({message: 'Successfully Logged in'});
        } else {
            console.log('password doesnot match');
            res.status(401).send({message: 'Wrong email or Password'});
        }
    }
});
app.post('/signup', async (req, res) => {
    const body = req.body;
    //console.log('req.body', body)
    try {
        const student = new Student(body);
        const result = await student.save();
        res.send({
            message: 'Student signup successful'
        });
    } catch (ex) {
        console.log('ex', ex);
        res.send({message: 'Error'}).status(401);
    }
});
app.post('/postUser', async (req, res) => {
    const user = new User(req.body);
    console.log('User', user);
    const result = await user.save();
    if (result) {
        res.send({
            message: "user inserted successfully."
        });
    }
});
app.get('/getUsers', async (req, res) => {
    const allusers = await User.find();
    res.send(allusers);
})

app.post('/updateUser', async (req, res) => {
    try {
        const user = new User(req.body);
        console.log('user', user);
        const result = await user.updateOne();
        if (result) {
            res.send({
                massage: "user Update Successfully"
            });
        }
    } catch (ex) {
        console.log('ex', ex);
        res.send({message: 'Error'}).status(401);
    }
});
app.post('/deleteUser', async (req, res) => {
    try {
        const user = new User(req.body);
        const result = await user.delete();
        if (result) {
            res.send({
                massage: 'user deleted Successfully.'
            });
        }
    } catch (ex) {
        console.log('ex', ex);
        res.send({message: 'Error'}).status(401);
    }
});
app.get('/getUsers', async (req, res) => {
    const allUsers = await User.find();

    console.log('users', allUsers);
    res.send(allUsers);
})


app.listen(4500, () => {
    console.log('port of server is 4500');
});

app.listen(process.env.PORT || 5000, () => {
    console.log('Express application running on ');

});
