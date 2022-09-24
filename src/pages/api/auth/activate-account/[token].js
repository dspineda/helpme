import { findOneUserByResetToken } from "../../../../../server/professional/professional.service";
import { signToken } from "../../../../../server/auth/auth.service";
import dbConnect from "../../../../../server/config/database";

export default async function verifyAccount(req, res) {
  await dbConnect();
  const { token } = req.query;
  try {
    let professional = await findOneUserByResetToken(token);
    if (!professional) {
      console.log("Invalid token");
      return res.status(400).json({ message: "Invalid token" });
    }

    if (professional.passwordResetActivationExpires < Date.now()) {
      console.log("Token expired");
      return res.status(400).json({ message: "Token expired" });
    }

      for (let i = 0; i <= professional.professional.length; i++) {
        if (
          professional.professional[i].passwordResetActivationToken === token
        ) {
          professional.professional[i].passwordResetActivationToken = null;
          professional.professional[i].isActivated = true;
          await professional.save();
          const jwt = await signToken({ email: professional.email });
          console.log("Account activated successfully");
          return res.status(200).json({ token: jwt });
        }
      }
    
  } catch (error) {
    console.log("Error activating account", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
