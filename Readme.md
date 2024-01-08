FoodBlogMode:-{

This is the schema, which means this is where u create a table.

export const Book = mongoose.model("Food-Blog", bookSchema);//Food-Blog inside the brackets is the Schema name.

}

When setting up MongoDb locally the link should have a DatabaseName eg:- here if u got to config.js file "mongodb://localhost:27017/Food-Blog-app" Food-Blog-app is the database name.

middleware :-

{

we need to convert the json for the server to understand, which is done using express;

where app is the const to which express is assigned

ie const app = express();
syntax:app.use(express.json());

}

BlogDataRouterFile:

for uploading image:-

{

1.import multer from "multer";
2.const storage = multer.memoryStorage();//declairing the temperoray storage

//declaration for permanant storage
3.const storage = multer.diskSorage({

    destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory where uploaded files will be stored

},
filename: function (req, file, cb) {
cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
},

})
4.const upload = multer({ storage: storage });//

1.mimetype represent the type of file
//it has two parts type and subtype
//type represents weather its an image ,video ,audio or text
//subtype represents the file extension eg jpeg for image
}

things to do:-
[

front end stuff:-

need a login page
need a registration page

home-> title
-content
-image
button newpost -> a pop up window-> -title
-content
-image

backend end stuff:-
-title
-content
-image
-uselogin info

]
image ->user id to identify which user uploaded the image

Troubles faced during server setup :-
Setting up multer
1.added multer only to one path, hence put method didn't work
2.Solved it by setting the path to default that is "/"

Express Middleware :-

1. import express
   import express, { response } from "express";

2. initialize express (imp step)
   const app = express();
   app.use(express.json()); //wasted lot of time caus this wasn't there

steps to set up multer:-

1.  install i multer.
2.  import the multer package.
    import multer from "multer";
3.  Initialize multer with path that u want multer to take effect.
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });
    router.use("/", upload.single("image"));

4.  setting("/") will make sure that multer works on all path.
