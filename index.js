import express from "express";
import {PORT, mongodbURL} from "./config.js";
import mongoose from "mongoose";
import navRoute from "./routes/navRoutes.js";
import browseMenuRoute from "./routes/browseMenuRoute.js";
import menuRoute from "./routes/menuRoute.js";
import nodemailer from "nodemailer"
import cors from "cors";
import bodyParser from "body-parser";
// import jwt from "jsonwebtoken";
// import bodyParser from "body-parser";
// import { exec } from "child_process";

const app = express();

//middle ware for parsing request body
app.use(express.json());


//middleware for handling cors
//option 1 allow all origins
app.use(cors());
//option 2 allow custom origin
// app.use(cors({
//     origin:'http://localhost:3000',
//     methods:['GET','POST','DELETE','PUT'],
//     allowedHeaders:['Content-Type'],
// }));

app.get('/', (request,response)=> {
    console.log(request);
    return response.status(234).send("Welcome to the server");

});

app.use("/nav",navRoute);
app.use("/browseMenu",browseMenuRoute);
app.use("/menu",menuRoute);

mongoose.connect(mongodbURL).then(() => {
    console.log("Connected to database");
    app.listen(PORT, ()=> {
        console.log(`App listening on ${PORT}`);
    });
}).catch((error) => {
    console.log(error)
})

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  email: String,
  otp: Number,
  verified: Boolean,
});

// Create a User model based on the schema
const User = mongoose.model('User', userSchema);

// //book a table
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // Endpoint to handle form submission
// app.post('/submit-form', (req, res) => {
//   const { name, phoneNumber, message } = req.body;

//   if (!name || !phoneNumber || !message) {
//     return res.status(400).json({ error: 'Please fill in all fields.' });
//   }

//   const gammuCommand = `gammu sendsms TEXT ${phoneNumber} -text "${message}"`;

//   exec(gammuCommand, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error: ${error.message}`);
//       return res.status(500).json({ error: 'Failed to send SMS.' });
//     }
//     if (stderr) {
//       console.error(`Error: ${stderr}`);
//       return res.status(500).json({ error: 'Failed to send SMS.' });
//     }
//     console.log(`SMS sent successfully!`);
//     console.log(`Response: ${stdout}`);
//     return res.status(200).json({ message: 'SMS sent successfully!' });
//   });
// });

//nodemailer

app.post('/send-email', (req, res) => {
    const { email, name, date, time, people } = req.body;
  
    // Create a nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'varunrunrunrun@gmail.com', // Replace with your Gmail email address
        pass: 'bpip bbel wnsj txqz' // Replace with your Gmail password or application-specific password if using 2FA
      }
    });
    console.log(email)
    const mailOptions = {
      from: 'varunrunrunrun@gmail.com', // Replace with your Gmail email address
      to: email,
      subject: 'Table Booking Confirmation',
      text: `Dear ${name},\n\nYour table for ${people} at ${date},${time} has been successfully booked. Thank you for choosing our service!\n\nBest regards,\nTasty Trail`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email: ', error);
        res.status(500).json({ error: 'Error sending email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Email sent successfully' });
      }
    });
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Nodemailer setup (Replace with your email configuration)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'varunrunrunrun@gmail.com', // Replace with your Gmail email address
    pass: 'bpip bbel wnsj txqz' // Replace with your Gmail password or application-specific password if using 2FA
  }
});

// User Registration API with OTP verification
app.post('/register', async (req, res) => {
  const { name, username, password, email } = req.body;

  // Generate OTP (for demonstration, use a random number)
  const otp = Math.floor(1000 + Math.random() * 9000);

  // Create a new User instance


  try {
        // Check if email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
        }
    
        // Generate OTP (for demonstration, use a random number)
        const otp = Math.floor(1000 + Math.random() * 9000);
    
        // Create a new User instance
        const newUser = new User({
          name,
          username,
          password,
          email,
          otp,
          verified: false,
        });
    // Save user details to the database
    await newUser.save();

    // Send OTP to user's email for verification
    const mailOptions = {
      from: 'varunrunrunrun@gmail.com',
      to: email,
      subject: 'OTP Verification for Registration',
      text: `Your OTP for registration is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Failed to send OTP for registration.');
      } else {
        console.log('Email sent for registration: ' + info.response);
        res.status(200).json({ message: 'OTP sent for registration.', email });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user.');
  }
});

// User Login API with OTP verification
app.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    // Find user by username or email in the database
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(404).send('User not found.');
    }

    // Verify password
    if (user.password !== password) {
      return res.status(401).send('Invalid password.');
    }

    if (user.password === password) {
      return res.status(200).send('Logged in Succesfuly');
    }

    // // Generate OTP for login verification
    // const otp = Math.floor(1000 + Math.random() * 9000);

    // // Update user's OTP in the database
    // user.otp = otp;
    // await user.save();

    // // Send OTP to user's email for login verification
    // const mailOptions = {
    //   from: 'your_email@gmail.com',
    //   to: user.email,
    //   subject: 'OTP Verification for Login',
    //   text: `Your OTP for login is: ${otp}`,
    // };

    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.log(error);
    //     res.status(500).send('Failed to send OTP for login.');
    //   } else {
    //     console.log('Email sent for login: ' + info.response);
    //     res.status(200).json({ message: 'OTP sent for login.', email: user.email });
    //   }
    // });
  } 
  catch (err) {
    console.error(err);
    res.status(500).send('Error logging in.');
  }
});

// OTP verification API for both register and login
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find user by email in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found.');
    }

    if(user.verified){
      return res.status(404).send('User already verified.');
    }

    if (user.otp !== parseInt(otp)) {
      return res.status(401).send('Invalid OTP.');
    }

    // Mark the user as verified
    user.verified = true;
    await user.save();

    // Respond with user verification status
    res.status(200).json({ message: 'OTP verified successfully.', verified: user.verified });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error verifying OTP.');
  }
});





