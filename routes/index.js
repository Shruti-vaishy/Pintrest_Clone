var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require("passport");
const localstrategy = require('passport-local');
const upload = require('./multer');

passport.use(new localstrategy(userModel.authenticate()));

router.get('/',function(req,res,next){
    res.render('index', {nav:false});
});

router.get('/register',function(req,res,next){
    res.render('register',{ nav:false});
});

router.get('/profile',isLoggedIn,async function(req,res,next){
    const user = 
    await userModel.
    findOne({username:req.session.passport.user})
    .populate("posts")    
    res.render('profile',{user, nav:true});
});

router.get('/edit',isLoggedIn, function(req,res,next){
res.render('');
});

router.get('/show/posts',isLoggedIn,async function(req,res,next){
    const user = 
    await userModel.
    findOne({username:req.session.passport.user})
    .populate("posts")    
    res.render('show',{user, nav:true});
});

router.get('/feed',isLoggedIn,async function(req,res,next){
    const user = 
    await userModel.
    findOne({username:req.session.passport.user})
    const posts = await postModel.find()
    .populate("user"); 

    res.render('feed',{user, posts, nav:true});
});

router.get('/add',isLoggedIn,async function(req,res,next){
    const user = await userModel.findOne({username:req.session.passport.user});
    res.render('add',{user, nav:true});
});

router.post('/createpost',isLoggedIn,upload.single("postimage"),async function(req,res,next){
    const user = await userModel.findOne({username:req.session.passport.user});
    const post = await postModel.create({
        user:user._id,
        title:req.body.title,
        description:req.body.description,
        image:req.file.filename
    });
    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
    
});

router.post('/fileupload',isLoggedIn,upload.single("image"),async function(req,res,next){
    // res.send("uploaded")
     const user = await userModel.findOne({username:req.session.passport.user});
     user.profileimage = req.file.filename;
     await user.save();
     res.redirect('/profile');
});

router.post('/register', async function(req,res,next){
    const existingUser = await userModel.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).render('register', { error: 'A user with the given username is already registered', nav: false });
        }
const data = new userModel({
    username:req.body.username,
    email:req.body.email,
    contact:req.body.contact,
    name:req.body.fullname
});
 await userModel.register(data,req.body.password)
    passport.authenticate("local")(req,res,function(){
        res.redirect('/profile');
    });
})


router.post('/login',passport.authenticate("local",{ 
    failureRedirect:"/",
    successRedirect: "/profile",
}),function(req,res,next){
    res.render('register');
});

router.get('/logout',function(req,res,next){
    req.logout(function(err){
        if(err) {return next(err);}
        res.redirect('/');
    });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

module.exports = router;
