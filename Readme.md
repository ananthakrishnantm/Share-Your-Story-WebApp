# Blog Website - Development

This is a **Blog Website** currently being developed locally. It features both **client-side** and **server-side** functionality, including **user authentication**.

The backend is connected to **MongoDB**, which is also set up locally for storing data.

## 🚀 Features

- **User Authentication**: User registration and login functionality.
- **Post Creation**: Users can create blog posts.
- **Comments & Likes**: Users can comment and like posts.
- **Follow/Unfollow**: Users can follow/unfollow other users.
- **Search**: Users can search by username or email.
- **Responsive Design**: Fully responsive layout for optimal viewing on all devices.

## ⚙️ How to Run

To launch both the **server** and **client**, use the following command:

```bash
npm run dev
```

This will start both the client-side and server-side applications.


## 📝 To-Do List

### 🔧 Important Bugs

- **Infinite Requests**: Infinite request loop issue in **follower list** and **comment components**.

### ✨ Features to Implement

1. **Add Comments and Likes** to posts.
2. **Search Functionality** to search by **username** or **email**.
3. **Pagination/Expand Text**: Implement a "See More" feature for longer post paragraphs.
4. **Fix Infinite Request Bug** from follower list and comment components.

### ✅ Done

1. **Follow/Unfollow State**: Updated the state of following/unfollowing a user.
2. **Follower List Pagination**: Implemented "next" feature for displaying followers.
3. **Navbar**: Created a navigation bar.
   - Future updates: 
     - Explore and view other users' blogs.
     - Categorize blogs.
     - Trending authors and recommended blogs.
4. **Modal**: On-click blog opens in a **card popup window** (modal).

### 🔧 Pending Issues

- **Path Issue**: In routes with `/id`, if cookies are deleted, it doesn't redirect to the login page.
- **User Profile Display**: Need to create an API endpoint to fetch all users' profile pictures.
- **Age Validation**: Ensure that users must be 18+ to register by checking their **date of birth**. (This is a lower priority.)

### 📝 Comment Input Flow

1. **Input Field**: User enters comment text and presses **Enter** or clicks the **Send** button.
2. **Edit Option**: Allow editing of comments after submission.
3. **Comment Display**: Show comment as a label once submitted.

### 🔧 Separate API Call

- Implement a separate API call for handling comment data.

## 🛠️ Technologies Used

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **File Upload**: Multer
- **Frontend**: React.js
- **State Management**: Zustand (currently considering integration)
- **Authentication**: JWT (JSON Web Tokens)

## 🧑‍💻 Future Improvements

- Explore **NextAuth.js** and **Auth0** for authentication.
