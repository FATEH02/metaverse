import { Router } from "express";
import {adminMiddleware} from "../middlewares/admin.js";
import {
  AddElementSchema,
  CreateAvatarSchema,
  CreateElementSchema,
  CreateMapSchema,
  UpdateElementSchema,
} from "./types/index.js";
import client from "../Db/index.js";
import { parse } from "dotenv";

export const adminRouter = Router();

adminRouter.post("/element", adminMiddleware, async (req, res) => {
  const parsedData = CreateElementSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({ message: "Validation falied" });
    return;
  }

  const element = await client.element.create({
    data: {
      width: parsedData.data.width,
      height: parsedData.data.height,
      static: parsedData.data.static,
      imageUrl: parsedData.data.imageUrl,
    },
  });

  res.json({
    id: element.id,
  });
});

adminRouter.put("/element/:elementId",adminMiddleware, (req, res) => {
  const parsedData = UpdateElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Vlidation failed" });
    return;
  }

  const ress =client.element.update({
    where: {
      id: req.params.elementId,
    },
    data: {
      imageUrl: parsedData.data.imageUrl,
    },
  });

  


  res.json({ message: "Element updated" });
});

adminRouter.post("/avatar",adminMiddleware, async (req, res) => {
  const parsedData = CreateAvatarSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Validation failed" });
    return;
  }

  const avatar = await client.avatar.create({
    data: {
      name: parsedData.data.name,
      imageUrl: parsedData.data.imageUrl,
    },
  });

  res.json({ id: avatar.id });
});

adminRouter.post("/map",adminMiddleware, async (req, res) => {
  const parsedData = CreateMapSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({ message: "Validation failed" });
    return;
  }

  const map = await client.map.create({
    data: {
      name: parsedData.data.name,
      width: parseInt(parsedData.data.dimensions.split("x")[0]),
      height: parseInt(parsedData.data.dimensions.split("x")[1]),
      thumbnail: parsedData.data.thumbnail,
      mapElements: {
        create: parsedData.data.defaultElements.map((e) => ({
          elementId: e.elementId,
          x: e.x,
          y: e.y,
        })),
      },
    },
  });

  res.json({
    id: map.id,
  });
});
