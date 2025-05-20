const authenticateUser = (req, res, next) => {
  // Check for JWT token first
  const cookies = req.headers.cookie;
  if (cookies) {
    const token = cookies.split("cookie=")[1];
    if (token) {
      try {
        const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
        req.userId = decodedToken.userId;
        return next();
      } catch (error) {
        console.log("JWT verification failed");
      }
    }
  }

  // If JWT token is not present or verification failed, proceed with Google authentication
  passport.authenticate("google", { session: false })(req, res, next);
};
