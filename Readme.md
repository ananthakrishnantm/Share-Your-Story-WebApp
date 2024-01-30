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

//change from local storage to cookies so that token can be send to every api call.
// also on server side make a middleware if cookies is present in api call request then validate token first and then resolve the user details from the token.

backend end stuff:-
-title
-content
-image
-uselogin info

]
image ->user id to identify which user uploaded the image

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

cookies,anti-pattern

check zustand.

could issues

1. cors
2. port-might be in different ports.
3. cookies is not getting saved locally.
