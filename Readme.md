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

\*\*check zustand.

To-Do-list

Main :-

2.  add comment and likes
3.  search option - to find username/emailid.
4.  see more if theres big paras a in post.

Done:-

1.  Update follow,unfollow state
2.  add follower list-next

3.  Creating a Nav bar
    Future updates
    -Explore and see others blog
    -Category
    -trending authors recomendation.
    -recomended blogs - which are trending.

4.  onCLick blog Views blog in a card popup window its called (modal)

    //issue to check -> in paths with /:id if cookies deleted it dsnt lead to the login page

5.  user need to show all users- create a new backend api endpoint for all users so that individual users profile pic can be shown.
    last. age should be 18+ to register check with dob (do this last dnt forget dumbass) .

6.  updating the state of followed and follower number in profile section.//least prio

Comment Input
-> Input Field->Enter the data->press enter ->send button
->sends the data
->edit option (edited)
->label to an input field  
->Comment will be displated as a label

-seperate api call

To-Look at stuff
-NExtAUth and Auth0
