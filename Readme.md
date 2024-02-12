README :-

About :-
This is a Blog webSite im developing locally right now.

The project has both client and server with user authentication mechanism.

MongoDb has been setup locally for this.

How to Run :-

Use the command npm run dev to launch both the server and client.

Troubles faced during server setup :-

1.  Forgot about middleware so spent some time over there.
2.  Needed an idea on how to upload files to mongodb database.
3.  Discovered about multer :-
    1.  found out about memoryStorage and Diskstorage
    2.  Diskstorage stores in servers send meta data to db
    3.  memoryStorage stores data as binary64 bit hexadecimal value as buffers.
4.  Multer was a pain in the ass, it had to be set to the initial path ie ("/") this
    thing for it to take effect on all the other paths like ("/:id"),
    hence put operation was not working when sending the data using postman through form-data.
5.  Form-data in postman sends binary data, hence multer path is crucial for it to accept
    throught Form-data.

check zustand.

To-Do-list

1.  age should be 18+ to register check with dob
