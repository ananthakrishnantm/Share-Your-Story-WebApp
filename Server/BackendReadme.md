//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

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



//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////


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

    4.  router.get("/",async(req,res)=>{  //get to display all the data
            try{
                const Fblog = await FoodBlog.find({});//find used to find the data
                return response.status(200).json(Fblog)
            }catch(err) {
                console.log(err);
                response.status(500).send(err);
            }
        })

    5.  router.get("/:id"  ,async(req,response) =>{

        try{
            const {id} = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) { //check to see if id is valid

            console.error("invalid object id format");

            return response.status(400).json({ message: "invalid id format" });

            const Fblog = await FoodBlog.findById(id);

            return response.status(200).json(Fblog);
    }
        }catch(err)=>{

            console.log(err);
            response.status.send(err);
        }

    })

    6.  router.put("/:id" , async(req,resp)=>{

        try{
            const {id} = req.params;

        const updateddata ={


        }


        const updatedFile = await file.findByIdAndUpdate(id,updateddata,{
            new true,
        })
        }catch(error)=>{
            console.log(error);
            response.status.send(error)
        }
    })

    7.    router.delete("/:id", async (request, response) => {
            try {
                const { id } = request.params;

                const result = await FoodBlog.findByIdAndDelete(id);

                return response.status(200).json({ message: "blog deleted successfully" });
            } catch (err) {
                console.log(err.message);
                response.status(500).json({ message: err.message });
            }
            });


//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////


mongoose functions:-

//find({})
//findById()
//findByIdAndUpdate()
//findByIdAndDelete()


//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

config.js :-
1.  has the port and the database url


//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

server.js :-
1.  we call everything in here. you can add multer here too.
2.  i called it in Routes caus well why not.

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////


SETTING UP MIDDLEWARE AND MULTER :-


Express Middleware :-

1. import express
   import express, { response } from "express";

2. initialize express (imp step)
   const app = express();
   app.use(express.json()); //wasted lot of time caus this wasn't there

steps to set up multer  :-

1.  install i multer.
2.  import the multer package.
    import multer from "multer";
3.  Initialize multer with path that u want multer to take effect.
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });
    router.use("/", upload.single("image"));

4.  setting("/") will make sure that multer works on all path.

Setting up multer:-

1.  added multer only to one path, hence put method didn't work
2.  Solved it by setting the path to default that is "/"


//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////





















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
