const express=require("express");
require('dotenv').config();
const cookieParser = require('cookie-parser'); 
const MongoStore = require("connect-mongo");
const session = require('express-session');
const methodOverride = require('method-override');

const app = express();
const PORT =  process.env.PORT || 5000;

//Active class which shows which page (home,contact,about) is selected
const { isActiveRoute} =  require('./server/helper/routeHelper');

//Static files usage (middleware)
app.use(express.static("public"));

//Cookie parser(middleware)
app.use(cookieParser());

//conection to database
const connectDB = require("./server/config/db.js");
connectDB();

//Middleware
const expressLayout = require('express-ejs-layouts');
//Templating Engine
app.use(expressLayout);
app.set('layout',"./layouts/main");
app.set("view engine", "ejs");

//Cookie (middleware) helps by not logging-in always
app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
  mongoUrl: process.env.MONGODB
  }),  
}));

//Override method
app.use(methodOverride('_method'));

//Passing data from client to server(middleware)
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//In the top the isActiveRoute is imported now we use it
app.locals.isActiveRoute = isActiveRoute;

//Server -> routes
app.use('/', require("./server/routes/main"));
app.use('/', require("./server/routes/admin"));


app.listen(PORT,()=>{
    console.log(`Listening to the port ${PORT}`);
});