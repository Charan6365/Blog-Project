
const express = require("express");
const router = express.Router();
const Post = require("../models/Post")
//Routes

//GET / HOME / All the posts
router.get('/',async (req,res)=>{
    const locals = {
        title: "NodeJs Blog",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
    }
    try{
        const data=await Post.find();
        res.render("index",{locals, data,currentRoute:'/'});
    }
    catch(error){ console.error(error.message);};
    
});

//GET /Specific post
router.get("/post/:id",async (req,res)=>{
    try{
        const id=req.params.id;
        const post = await Post.findById({_id:id});
        const locals = {
            title: post.title,
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }
        res.render("post", {locals, data:post,currentRoute:`/post/${id}`});
    }
    catch(error){
        console.log(error.message);
    }
});

//Seaches posts based on the text very usefull
router.post("/search",async (req,res)=>{
    try{
        const locals = {
            title: "Search",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }
        let searchTerm =req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"");
        const data = await Post.find({
            $or: [
                {title : {$regex: new RegExp(searchNoSpecialChar, 'i')}}
            ]
        });
       
        res.render("search-result",{ data, locals,currentRoute:''});

    }
    catch(error){ console.error(error.message);};
    
});

//About page(incomplete)
router.get('/about',(req,res)=>{
   res.render('about',{
      currentRoute:'/about'
   });
});

//contact page(incomplete)
router.get('/contact',(req,res)=>{
    res.render('contact',{
       currentRoute:'/contact'
    });
 });

module.exports= router;











// function insertPostData(){
//     Post.insertMany([
//         {
//             title: "The Future of Artificial Intelligence",
//             body: "Artificial Intelligence (AI) is transforming industries with applications in healthcare, finance, and education. Explore the advancements and future prospects of AI."
//         },
//         {
//             title: "10 Tips for a Successful Remote Work Setup",
//             body: "Remote work is here to stay. Learn how to create an efficient and comfortable workspace at home with these ten tips."
//         },
//         {
//             title: "A Journey Through the Himalayas",
//             body: "The Himalayas offer breathtaking views and challenging trekking routes. Join us as we explore the beauty and culture of this majestic mountain range."
//         },
//         {
//             title: "Understanding Cryptocurrency and Blockchain",
//             body: "Cryptocurrency and blockchain technology are revolutionizing the financial world. This article breaks down the basics and explores their potential impact."
//         },
//         {
//             title: "The Benefits of Mindfulness Meditation",
//             body: "Mindfulness meditation can reduce stress and improve overall well-being. Discover the benefits and how to get started with this practice."
//         },
//         {
//             title: "Top 5 Destinations for Adventure Travel",
//             body: "Looking for your next adventure? Check out these top destinations for thrilling outdoor activities and unique experiences."
//         },
//         {
//             title: "Healthy Eating: A Beginner's Guide",
//             body: "Maintaining a healthy diet is crucial for overall well-being. Learn the basics of healthy eating and how to make nutritious choices."
//         },
//         {
//             title: "The Impact of Social Media on Society",
//             body: "Social media has significantly altered how we communicate and consume information. Explore its impact on society and personal relationships."
//         },
//         {
//             title: "Essential Skills for the Modern Workforce",
//             body: "The job market is constantly evolving. Discover the essential skills that will keep you competitive in the modern workforce."
//         },
//         {
//             title: "Exploring the Wonders of Marine Life",
//             body: "The ocean is home to a diverse range of marine life. Dive into the fascinating world of underwater ecosystems and their inhabitants."
//         },
//         {
//             title: "The Art of Effective Time Management",
//             body: "Managing your time effectively is key to productivity. Learn strategies to prioritize tasks and manage your time more efficiently."
//         },
//         {
//             title: "A Guide to Sustainable Living",
//             body: "Sustainable living is about reducing your environmental impact. This guide offers practical tips on how to live more sustainably."
//         },
//         {
//             title: "The Evolution of Mobile Technology",
//             body: "Mobile technology has rapidly evolved over the past few decades. Explore the key advancements and their impact on daily life."
//         },
//         {
//             title: "Cultural Insights: Exploring Global Festivals",
//             body: "Festivals around the world celebrate diverse cultures and traditions. Join us as we explore some of the most vibrant global festivals."
//         },
//         {
//             title: "The Importance of Mental Health Awareness",
//             body: "Mental health is a critical aspect of overall well-being. Learn about the importance of mental health awareness and resources available for support."
//         },
//         {
//             title: "The Rise of Renewable Energy",
//             body: "Renewable energy sources are becoming increasingly important. Explore the benefits and challenges of transitioning to renewable energy."
//         },
//         {
//             title: "Tips for Learning a New Language",
//             body: "Learning a new language can open up new opportunities. Discover effective tips and resources to help you start learning a new language today."
//         },
//         {
//             title: "The Role of Art in Society",
//             body: "Art plays a significant role in shaping culture and society. Explore how art influences and reflects societal values and issues."
//         },
//         {
//             title: "A Beginner's Guide to Investing",
//             body: "Investing can be a powerful tool for building wealth. This beginner's guide covers the basics and provides tips on getting started."
//         },
//         {
//             title: "Exploring the Science of Climate Change",
//             body: "Climate change is one of the most pressing issues of our time. Understand the science behind climate change and its potential impacts."
//         }
//     ]);
// }

// insertPostData();