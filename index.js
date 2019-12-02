const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/owaisTable', {useNewUrlParser: true}, ()=>console.log('connected'));

const Student = mongoose.model('Student', {
    name: String,
    id: Number,
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
app.post('/postStudent', async (req, res) => {
    const student = new Student(req.body);
    console.log('student', student);
    const result = await student.save();
    if (result) {
        res.send({
            message: "Student inserted successfully."
        });
    }
});
app.get('/getStudents', async (req, res) => {
    const allStudents = await Student.find();
    res.send(allStudents);
})

app.listen(4500, () => {
    console.log('port of server is 4500');
});
