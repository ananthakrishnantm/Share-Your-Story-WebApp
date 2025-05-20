import { verifyEmailToken } from "../Services/userService.js";

export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  console.log(token);

  try {
    const result = await verifyEmailToken(token);

    if (result.success) {
      res.status(200).json({ message: "Email verified successfully!" });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
