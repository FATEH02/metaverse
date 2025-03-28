import { Router } from "express";
import {
  AddElementSchema,
  CreateElementSchema,
  CreateSpaceSchema,
  DeleteElementSchema,
} from "./types/index.js";
import client from "../Db/index.js";
import { userMiddleware } from "../middlewares/user.js";

export const spaceRouter = Router();


//!creating the space

spaceRouter.post("/", userMiddleware, async (req, res) => {

    const parsedData = CreateSpaceSchema.safeParse(req.body);

    

    if (!parsedData.success) {
      res.status(400).json({ message: "Validation failed" });
      return
    }

    //if user didt provide a mapid it means they waht to creat a beand neww space withour copying from an exsisting map

    if (!parsedData.data.mapId) {
      const space = await client.space.create({
        data: {
          name: parsedData.data.name,
          width: parseInt(parsedData.data.dimensions.split("x")[0]),
          height: parseInt(parsedData.data.dimensions.split("x")[1]),
          creatorId: req.userId,
        },
      });
      res.json({ spaceId: space.id });
      return
    }
    // if want to use pre existing map

    //creating preexisgting map
    // console.log("Received mapId:", parsedData.data.mapId);
    // const allMaps = await client.map.findMany();
    // console.log("maps"+allMaps);
    
    const map = await client.map.findUnique({
      where: {
        id: parsedData.data.mapId,
      },
      select: {
        mapElements: true,
        width: true,
        height: true,
      },
    });

    // console.log(map);
    
    
    if (!map) {
      // console.log("No map found for id:", parsedData.data.mapId);
      res.status(400).json({ message: "Map not found" });
      return;
    }

  let space = await client.$transaction(async () => {
    const space = await client.space.create({
      data: {
        name: parsedData.data.name,
        width: map.width,
        height: map.height,
        creatorId: req.userId,
      },
    });

    await client.spaceElements.createMany({
      data: map.mapElements.map((e) => ({
        spaceId: space.id,
        elementId: e.elementId,
        x: e.x,
        y: e.y,
      })),
    });
    return space;
  });
  res.json({ spaceId: space.id });
});



//!deleting the space

spaceRouter.delete("/:spaceId",userMiddleware, async (req, res) => {

  // console.log(req.params.spaceId);

  console.log("deleted id");
    console.log(req.params.spaceId);
    console.log(req.userId);
    
    
    
  const space = await client.space.findUnique({
    where: {
      id: req.params.spaceId,
    },
    select: {
      creatorId: true,
    },
  });

  if (!space) {
    res.status(400).json({ message: "Space not found" });
    return;
  }

  // console.log(space.creatorId);
  // console.log(req.userId);
  

  if (space?.creatorId !== req.userId) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  await client.spaceElements.deleteMany({
    where: {
      spaceId: req.params.spaceId,
    },
  });
  
  await client.space.delete({
    where: {
      id: req.params.spaceId,
    },
  });
  
  res.json({ message: "Space deleted" });
  
});


//!get all spaces of the user

spaceRouter.get("/all", userMiddleware, async (req, res) => {
  const spaces = await client.space.findMany({
    where: {
      creatorId: req.userId,
    },
  });

  res.json({
    spaces: spaces.map((s) => ({
      id: s.id,
      name: s.name,
      thumbnail: s.thumbnail,
      dimensions: `${s.width}x${s.height}`,
    })),
  });
});


//!ad an element to the space
spaceRouter.post("/element", userMiddleware, async (req, res) => {
  const parsedData = AddElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Vlidatioonf failed" });
    return;
  }
  const space = await client.space.findUnique({
    where: {
      id: req.body.spaceId,
      creatorId: req.userId,
    },
    select: {
      width: true,
      height: true,
    },
  });
  if (!space) {
    res.status(400).json({ message: "Space not ffound" });
    return;
  }

  await client.spaceElements.create({
    data: {
      spaceId: req.body.spaceId,
      elementId: req.body.elementId,
      x: req.body.x,
      y: req.body.y,
    },
  });

  res.json({ message: "Element added" });
});

//!delete an element to the space
spaceRouter.delete("/element", userMiddleware, async (req, res) => {
  try {
    console.log("reached here");

    const parsedData = DeleteElementSchema.safeParse(req.body);

    console.log(req.body);
    console.log(parsedData);
    

    if (!parsedData.success) {
      res.status(400).json({ message: "Validation failed" });
      return;
    }

    const spaceElements = await client.spaceElements.findFirst({
      where: {
        id: req.body.id,
      },
      include: {
        space: true,
      },
    });

    if (!spaceElements) {
      res.status(404).json({ message: "Element not found" });
      return;
    }

    if (spaceElements.space.creatorId !== req.userId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    await client.spaceElements.delete({
      where: {
        id: parsedData.data.id,
      },
    });

    res.json({ message: "Element deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//!get detail of a space
spaceRouter.get("/:spaceId", async (req, res) => {
  const space = await client.space.findUnique({
    where: {
      id: req.params.spaceId,
    },
    include: {
      elements: {
        include: {
          element: true,
        },
      },
    },
  });

  if (!space) {
    res.status(400).json({ message: "Space not found" });
    return;
  }

  res.json({
    dimensions: `${space.width}x${space.height}`,

    elements: space.elements.map((e) => ({
      id: e.id,
      element: {
        id: e.element.id,
        imageUrl: e.element.imageUrl,
        width: e.element.width,
        height: e.element.height,
        static: e.element.static,
        x: e.x,
        y: e.y,
      },
    })),
  }); 
});
