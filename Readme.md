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

!!!!!!IMPORTANT BUG
-Inifnite request from followerList and comment components.

1. adding word limit to everything.
2. suggetions need to be fixed(if a follower follows sm1 then he can be used as a suggetion for the other person).
3. adding a limit to number of sugetions(4 suggetions max)/it should also be in rotation (also if sm1 already follows sm1 it shouldnt be)

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

7.  add comment and likes
8.  search option - to find username/emailid.

-seperate api call
To-Look at stuff

-adding a filter for new and hottest posts.
-Proxy middleware

video things to do :-

1. profile pic generator.
2. adding node mailer to add email verification to account.
3. make a video on infinite scroll.

For Tomorrow :-

1.recomended followers
2.add view profile option for recomended followers.

imp:-
add following list too dont forget dumbass...

For suggested users
-> A Follows B, B Follows C Suggest C To A.
-> mutual interests - ask the users for their interests - add some interests


report system :-
when clicking on report bring two options, report or block




Trending section
weighted system based on likes, views and comments.
