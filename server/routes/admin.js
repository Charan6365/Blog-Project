
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//As the default layout is set to layout folder and main file is default considered as main.ejs file but below statement changes the layout to folder admin and default to admin.ejs file
const adminLayout = "../views/layouts/admin";


//Logion and Register

//Checks the session and token 
const authMiddleWare = (req , res, next)=>{
   const token =  req.cookies.token;

   if(!token){
    return res.status(401).json({ message:'Unauthorized' });
   }

   try{
    const decoded = jwt.verify(token, jwtSecret);
    req.userId =  decoded.userId;
    next();
   }
   catch(error){
    res.status(401).json({ message:'Unauthorized' });
   }
};

// GET / Admin - Login Page
router.get("/admin",async (req,res)=>{
    try{
     const locals={
      title: "Admin",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
     }
       
     res.render("admin/index",{locals, layout: adminLayout });
    }
    catch(error){
        console.log(error);
    }
});


//Post /Admin-Check details
//calling the secret for the token from .env file
jwtSecret = process.env.jwtSecret;
router.post("/admin",async (req,res)=>{
    try{
     const {username , password} = req.body;
     const user= await User.findOne({username});
       if(!user){
        res.status(401).json({message: 'Invalid credentials'});
       }
       const isPasswordValid = await bcrypt.compare(password, user.password);
       if(!isPasswordValid){
        res.status(401).json({message: 'Invalid credentials'});
       }

       const token = jwt.sign({ userId: user._id},jwtSecret);
       res.cookie('token', token , {httpOnly : true});
       res.redirect('/dashboard');
    }
    catch(error){
        console.log(error);
    }
});



//Get /Dashboard of admin
router.get('/dashboard',authMiddleWare, async (req,res)=>{
    try{
        const locals ={
            title:'Dashboard',
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
        }
        const data = await Post.find();
        res.render('admin/dashboard',{
            locals,data,layout: adminLayout
        });
    }
    catch(error){
        console.log(error);
    }
 
});


// //Post /Admin-Register details /At present it is disabled
router.post("/register",authMiddleWare ,async (req,res)=>{
    try{
     const {username , password} = req.body;
     console.log(req.body);
     const hashedPassword = await bcrypt.hash(password, 10);
     
     try{
        const user = await User.create({username , password: hashedPassword});
        res.status(201).json({ message: 'User Created' ,user});
     }
     catch(error){
        if(error.code === 11000 )//This line means that if a username already exists then mongodb sends error 11000 erroras the username is primary field
        {
            res.status(409).json({ message: 'User already in use' ,user});
        }
        res.status(500).json({ message: 'Internal server error'});
     }
       
   res.redirect("/admin");
    }
    catch(error){
        console.log(error);
    }
});

//GET /Admin - Create New Post
router.get('/add-post',authMiddleWare, async (req,res)=>{
    try{
        const locals ={
            title:'Add Post',
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
        }
        const data = await Post.find();
        res.render('admin/add-post',{
            locals,data,layout: adminLayout
        });
    }
    catch(error){
        console.log(error);
    }
 
});

//POST /Admin - Add post to DB
router.post('/add-post',authMiddleWare, async (req,res)=>{
    try{
        const {title,body} = req.body;
        const data = await Post.create({title:title,body:body});
       res.redirect("/dashboard");
    }
    catch(error){
        console.log(error);
    }
 
});

//GET /Edit-post page sending
router.get('/edit-post/:id',authMiddleWare, async (req,res)=>{
    try{
        const id=req.params.id;
        const data = await Post.findOne({_id:id});
        res.render(`admin/edit-post`,{data,layout: adminLayout});
    }
    catch(error){
        console.log(error);
    }
 
});

//PUT /edit details in DB
router.post("/edit-post/:id",authMiddleWare, async (req,res)=>{
    try{
      const {title,body}=req.body;
      const data={
        title:title,
        body:body,
        updatedAt:Date.now()
      }
     await Post.findByIdAndUpdate(req.params.id,data);
     res.redirect("/dashboard");
    }
    catch(error){
        res.status(500).json({ message: 'Internal server error'});
    }
});

//DELETE /delete a post
router.delete("/delete-post/:id",authMiddleWare, async (req,res)=>{
    try{
      const id=req.params.id;
     await Post.deleteOne({_id:id});
     res.redirect("/dashboard");
    }
    catch(error){
        res.status(500).json({ message: 'Internal server error'});
    }
});

//GET /Admin logout
router.get('/logout',async (req,res)=>{
    res.clearCookie('token');
    //res.json({message: 'Logout successful.'});
    res.redirect('/');

});

module.exports= router;