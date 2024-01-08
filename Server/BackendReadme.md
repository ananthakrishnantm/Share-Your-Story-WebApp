````FoodBlogModel.js
1.  This contains the schema aka table.
2.  steps in implementing the schema.
    1. Import mongoose from "mongoose".
    2. Declare and export the Schema/ table name with data inside.
    Syntax :-
    // const foodBlogSchema = mongoose.Schema({data here with type})
    // export const FoodBlog = mongoose.model("Food-Blog", foodBlogSchema);
    3. mongoose.model("Food-Blog", foodBlogSchema) this creates a new collection
       with the name Food-Blog where data is entered.
    4. Use timestamps:true inside the schema to get uploaded and edited time of data.

```routes/BlogDaaRoutes.js
1.  This is where the CRUD operations are performed(Create , Read, Update and Delete)
2.  For setting up Route :-
    1.  import express from "express"       //import express.
    2.  const router = express.Router();    //assign router to a variable.

                                            //for posting data to Schema/table

    3.  router.post("/path",async(req,res)=>{

        try{
            const newData = await Schema.create(newData)
            return respone.status(200).send(newData);
        }catch(err)=>{
            console.log(err)
            response.status(500).send(err);

        }
    })









config.js
has the port and the database url





















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
````
