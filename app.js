const express=require('express')
const mongoose = require('mongoose');
const app=express();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const path=require('path');
const userModel = require('./models/user');
const theaterModel = require('./models/theater');
const movieModel = require('./models/movie');
const bookingModel = require('./models/booking');

const cookieParser = require('cookie-parser');
const bcrypt= require('bcrypt');
const { JsonWebTokenError } = require('jsonwebtoken');
const jwt=require('jsonwebtoken');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


app.get('/', (req,res)=>{
    res.render("index");
});

app.get('/login-user', (req,res)=>{
    res.render("login-user");
})

app.post("/login-user", async(req,res)=>{
    let {username,password}= req.body;

    let user = await userModel.findOne({username});
    if(!user) return res.status(500).send("something went wrong");

    bcrypt.compare(password, user.password, (err, result)=>{
        if(result){  
            let token= jwt.sign({username: username, userid: user._id, }, "shhhh");
            res.cookie("token", token);
            res.status(200).redirect(`/profile-user/${user._id}`);
        } 
        else{
            res.redirect("/login-user");
        }
    })
})

app.get('/signup-user', (req,res)=>{
    res.render("signup-user");
})

app.post('/signup-user', async (req,res)=>{
    let {username, email ,password}= req.body;

    let user = await userModel.findOne({email});
    if(user) return res.status(500).send("user already exists");

    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(password, salt, async (err,hash)=>{
            let user = await userModel.create({
                username,
                password:hash,
                email
            });

            let token= jwt.sign({email: email, userid: user._id, }, "shhhh");
            res.cookie("token", token);
            res.render("login-user");
        })
    })
})

app.get('/login-theater', (req,res)=>{
    res.render("login-theater");
})

app.post("/login-theater", async(req,res)=>{
    let {username,password}= req.body;
    console.log("inside login theraer post");

    let user = await theaterModel.findOne({username});
    if(!user) return res.status(500).send("something went wrong");

    bcrypt.compare(password, user.password, (err, result)=>{
        if(result){
            let token= jwt.sign({username: username, userid: user._id, }, "shhhh");
            res.cookie("token", token);
            res.status(200).redirect("profile-theater");
        } 
        else{
            res.redirect("/login-theater");
        }
    })
})

app.get('/signup-theater', (req,res)=>{
    res.render("signup-theater");
})

app.post('/signup-theater', async (req,res)=>{
    let {username, email ,password, theatername}= req.body;

    let user = await theaterModel.findOne({email});
    if(user) return res.status(500).send("user already exists");

    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(password, salt, async (err,hash)=>{
            let user = await theaterModel.create({
                username,
                password:hash,
                email,
                theatername
            });

            let token= jwt.sign({email: email, userid: user._id, }, "shhhh");
            res.cookie("token", token);
            res.render("login-theater");
        })
    })
})

app.get('/logout', (req,res)=>{
    res.redirect("/");
})

app.post('/profile-user', (req,res)=>{
    res.render('profile-user')
})

app.get('/profile-user/:userid', async(req,res)=>{
    let {userid}= req.body;
    try {
        const user = await userModel.findOne({userid});
        res.render('profile-user');
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
})

app.post('/profile-theater', (req,res)=>{
    res.render('profile-theater')
})

app.get('/profile-theater', async(req, res) => {
    try {
        const movies = await movieModel.find().sort({ vote: -1 }).limit(3);
        res.render('profile-theater', { movies });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});


app.get('/vote', async (req,res)=>{
    
    let {userid}= req.body;
    try {
        const user = await userModel.findOne({userid});
        res.render('vote', { user });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
    //res.render("vote");
})

app.get('/book', async (req, res) => {
    try {
        const movies = await bookingModel.find();
        res.render('book', { movies });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

app.get('/seat-booking', async (req, res) => {
    res.render("seat-booking.ejs");
});

app.get('/add-more', (req,res)=>{
    res.render("add-more");
})

app.post('/add-more', upload.single('image'), async (req, res) => {
    const { moviename, director,writer, stars, imdbrating, summary, vote} = req.body;

    // Ensure req.file is being logged to check if it's coming through
    console.log(req.file);

    try {
        // Check if the file is present
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const newMovie = new movieModel({
            moviename,
            director,
            writer,
            stars: stars.split(','), // Convert stars string to an array
            imdbrating,
            summary,
            vote,
            image: {
                data: req.file.buffer, // Access the file buffer
                contentType: req.file.mimetype
            }
        });

        await newMovie.save();
        res.status(201).json({ message: 'Movie added successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/list', async (req, res) => {
    try {
        const movies = await movieModel.find().sort({ vote: -1 });
        res.render('list', { movies });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

app.get('/finalize-for-booking', async (req,res)=>{
    let {moviename}= req.body;
    try {
        const movies = await movieModel.find({}, 'moviename');
        res.render('finalize-for-booking', { movies });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
})

app.post('/finalize-for-booking', async (req, res) => {
    try {
        const { moviename, theatername, date } = req.body;

        // Create a new booking
        const newBooking = new bookingModel({
            moviename,
            theatername,
            date,
        });

        // Save to database
        const savedBooking = await newBooking.save();

        // Return the saved booking as a response
        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(500).json({ error: 'Error creating booking' });
    }
});

app.get('/about', (req,res)=>{
    res.render("about");
})

app.listen(3000,()=>{
    console.log('Listening on port:3000');
});