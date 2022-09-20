import dbConnect from "../../../../../server/config/database";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { createProfessional, findProfessionalByEmail } from "../../../../../server/professional/professional.service";
import {sendMailSendGrid} from "../../../../utils/mail";


export default async function handler(req, res) {
  await dbConnect();
  const userData = req.body;
  const userFound = await findProfessionalByEmail(userData.professional.email);
  console.log("🚀 ~ file: register-professional.js ~ line 11 ~ handler ~ userFound", userFound)
 
  if (userFound) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    const hash = crypto
      .createHash("sha256")
      .update(userData.professional.email)
      .digest("hex");
      userData.professional.passwordResetActivationToken = hash;
      userData.professional.passwordResetActivationExpires = Date.now() + 3_600_000 * 24; // 24 hour

      const salt = await bcrypt.genSalt();
      const hash2 = await bcrypt.hash(userData.professional.password, salt);
      console.log("🚀 ~ file: register-professional.js ~ line 28 ~ handler ~ hash2", hash2)

      userData.professional.password = hash2;
      
    const professional = await createProfessional(userData);
    // Send email to professional
    const emailData = {
      from: '"no-reply" <dspinedao@outlook.com>',
      to: userData.professional.email,
      subject: "Welcome to HelpMe!!",
      preheader: 'Activate your Account Now.',
      template_id: 'd-8e132668b8f7429ea99a743ed92f30e6',
      dynamic_template_data: {
        //name: user.name.capitalize(),
        //lastName: user.lastName.capitalize(),
        url: `http://localhost:3000/activate-account/${hash}`,
      },
    };
    await sendMailSendGrid(emailData);
    console.log('User created successfully', professional);
    return res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    console.log('Error creating user', error);
    return res.status(500).json({ message: 'Error creating user' });
  }
}
