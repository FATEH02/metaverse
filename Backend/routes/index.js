import express from "express";
const router = express.Router();
import {adminRouter} from "./admin.js"
import { userRouter } from "./user.js";
import { spaceRouter } from "./space.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { CreateAvatarSchema, SigninSchema } from "./types/index.js";
import { SignupSchema } from "./types/index.js";
import client from "../Db/index.js";
import { isValidObjectId } from "mongoose";


router.post("/signup", async (req, res) => {
  const parsedData = SignupSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({ message: "Validation failed" });
  }

  const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

  try {
    const user = await client.user.create({
      data: {
        username: parsedData.data.username,
        password: hashedPassword,
        role: parsedData.data.type === "admin" ? "Admin" : "User",
      },
    });

    const token = jwt.sign({
      userId: user.id,
      role: user.role,
      username:user.username   
    }, "fateh");


    res.json({ userId: user.id,token:token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "User already exist went wrong" });
  }
});


router.post("/login", async (req, res) => {
  
  const parsedData = SigninSchema.safeParse(req.body);
  console.log(req.body);
  
  if (!parsedData.success) {
    res.status(403).json({ message: "Validation Failed" });
    return;
  }

  console.log("reached");

  try {
    const user = await client.user.findUnique({
      where: {
        username: parsedData.data.username,
      },
    });

    if (!user) {
      res.status(403).json({ message: "User Not Found" });
      return;
    }

    const isValid = await bcrypt.compare(parsedData.data.password, user.password);

    if (!isValid) {
      res.status(403).json({ message: "Invalid password" });
      return;
    }

    const token = jwt.sign({
      userId: user.id,
      role: user.role,
      username:user.username   
    }, "fateh");

    res.json({
      token: token
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




router.get("/elements",async (req, res) => {

  const elements =await client.element.findMany()

   res.json({elements:elements.map(e=>({
    id:e.id,
    imageUrl:e.imageUrl,
    width:e.width,
    height:e.height,
    static:e.static
   }))})
   
});

router.get("/maps",async(req,res)=>{

  const maps = await client.map.findMany()

  res.json({maps:maps.map(x=>({
    id:x.id,
    imageUrl:x.thumbnail,
  }))})

})




router.get("/avatars",async (req, res) => {
  const avatars =  await client.avatar.findMany()

  res.json({avatars:avatars.map(x=>({
    id:x.id,
    imageUrl:x.imageUrl,
    name:x.name
  }))})
});




router.use("/user", userRouter);

router.use("/space", spaceRouter);

router.use("/admin", adminRouter);

export default router;
