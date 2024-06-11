
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const logger = require('morgan');
const expressSession = require('express-session');
const passport = require("passport");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
// const localstrategy = require("passport-local");

const app = express();

app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:"hey hey"
}));

app.use(passport.initialize());
app.use(passport.session());
// passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");


app.use('/',indexRouter);
app.use('/users',usersRouter)

app.listen(3000);