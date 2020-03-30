const express = require("express");
require('dotenv').config();
const next = require("next");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production"; //true false
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler(); //part of next config
const mongoose = require("mongoose");
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const User = require('./models/User')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const basicAuth = require('express-basic-auth')


mongoose.connect(process.env.DEV_DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

nextApp.prepare().then(() => {
    // express code here
    const app = express();
    const sess = {
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: {httpOnly: false},
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    }
       
    if (app.get('env') === 'production') {
        app.set('trust proxy', 1) // trust first proxy
        sess.cookie.secure = false // serve secure cookies
    }
       
    app.use(session(sess));

    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({ username }, function(err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    
    app.use(cors());
    // app.use(function(req, res, next) {
    //     res.header('Access-Control-Allow-Credentials', true);
    //     res.header('Access-Control-Allow-Origin', req.headers.origin);
    //     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //     res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    //     if ('OPTIONS' == req.method) {
    //         res.send(200);
    //     } else {
    //         next();
    //     }
    // });
    app.use(cookieParser());
    // app.options('/api/users', cors({credentials: true, origins: ['https://www.preventiongeneration.com', 'https://www.prevention-generation.herokuapp.com']}));
      
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use( /^\/api/ ,basicAuth({
        users: { 'admin': process.env.BASIC_AUTH_PASS },
        unauthorizedResponse: {message: 'unauthorized'}
    }))
    app.use("/api/users", require("./routes/users"));
    app.use("/api/tags", require("./routes/tags"));
    app.use("/api/articles", require("./routes/articles"));
    app.use("/api/products", require("./routes/products"));
    app.use("/api/uploads", require("./routes/uploads"));
    app.use("/api/providers", require("./routes/providers"));
    app.use("/api/suppliers", require("./routes/suppliers"));
    app.use("/api/payments", require("./routes/payments"));
    app.use("/api/update-fuzzy", require("./routes/updateFuzzy"));
    app.get("*", (req,res) => {
        return handle(req,res); // for all the react stuff
    });
    app.listen(PORT, err => {
        if (err) throw err;
        console.log(`ready at http://localhost:${PORT}`);
    });
});