const User = require("../modles/user.model");
const jwt = require("jsonwebtoken");

//generate jwt token

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, "hello", { expiresIn: "30d" });
};

//register the user the function that registrer gthe user

// exports.registerUser = async (req, res) => {

//   const { name, email, password } = req.body;

//   try {
//     //try to find user if it aleready exist
//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       return res.status(400).json({ message: "user already exists" });
//     }

//     //if not already existsthen create one
//     const hashPassword = await User.hashPassword(password);

//     const user = await User.create({ name, email, password: hashPassword });

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message + "hello" }); 
//   }
// };





exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //find user by email

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "invalid email or password",
      });
    }

    //if email exist then we will check for the password

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      toek: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
