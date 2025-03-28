//!creates new user 
import { WebSocket } from "ws";
import { RoomManager } from "./RoomManager";
import { OutgoingMessage } from "./types";
import client from "../../Db/index.js";
import jwt, { JwtPayload } from "jsonwebtoken";




//!create random string so that evey user can hae unique id
function getRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random()) * characters.length);
  }
  return result;
}




//!an user insance

export class User {
  public id: string; //unique id per suer session (random string)
  public userId?: string;//optional:real userid from jwt
  private spaceId?: string;//space or room id user has joined
  private x: number;//x position in the space
  private y: number;//y position in the space

  constructor(private ws: WebSocket) {
    this.id = getRandomString(10);//gives random session id
    this.x = 0;
    this.y = 0;
  }


  //!listens for messages
  initHandlers() {


    this.ws.on("message", async (data) => {
      const parsedData = JSON.parse(data.toString());

      console.log(parsedData.type);
      

      switch (parsedData.type) {    
        //join functions what will happend when user join
//!joing the space      
        case "join":
           console.log("space Joined");
          const spaceId = parsedData.payload.spaceId;//get space id from the user
          const token = parsedData.payload.token;//get roken from the ws
          const userId = (jwt.verify(token, "fateh") as JwtPayload).userId;//!verify the user
          
          console.log(userId);
          
          
          if (!userId) {
            console.log("disconnected");
            
            this.ws.close();
            return;
          }
          
          //check the spaceid if exists in the database

          const space = await client.space.findFirst({
            where: {
              id: spaceId,
            },
          });
          

          if (!space) {
            this.ws.close();
            return;
          }

          this.spaceId = spaceId; //if validaed then save space id 

          RoomManager.getInstance().addUser(spaceId, this);
           
          //sets random x and y cordinates

          this.x = Math.floor(Math.random() * space?.width);
          this.y = Math.floor(Math.random() * space?.height);

          //senda a message back to the user with their spawn position and other users
          this.send({
            type: "space-joined",
            payload: {
              //TODO
              spawn: {
                x: this.x,
                y: this.y,
              },
              users:RoomManager.getInstance().rooms.get(spaceId)?.filter(x=>x.id!==this.id).map((u) => ({ id: u.id })) ?? [],
            },
          });

          //and brodcast to toher
          RoomManager.getInstance().broadcast(
            {
              type: "user-joined",
              payload: {
                userId: this.id,
                x: this.x,
                y: this.y,
              },
            },
            this,
            this.spaceId!
          );
          break;

          //what will happen when user move

        case "move":
          //when user moves
          const moveX = parsedData.payload.x;
          const moveY = parsedData.payload.y;

          //checks move is valid or not

          const xDisplacement = Math.abs(this.x - moveX);
          const yDisplacement = Math.abs(this.y - moveY);

          //  console.log("movedfsdfX");

           
          //only one unit move in any direction 
          if (
            (xDisplacement == 1 && yDisplacement == 0) ||
            (xDisplacement == 0 && yDisplacement == 1)
          ) {
            this.x = moveX;
            this.y = moveY;
            //broadcast this to everyone about new postion 
            RoomManager.getInstance().broadcast(
              {
                type: "move",
                payload: {
                  x: this.x,
                  y: this.y,
                },
              },
              this,
              this.spaceId!
            );
            return;
          }
//if move is invaoid thaen movement is rejected
          this.send({
            type: "movement-rejected",
            payload: {
              x: this.x,
              y: this.y,
            },
          });

          (this.x = moveX), (this.y = moveY);
      }
    });
  }


//called when a user disconnects websocket event  
destroy(){
  //remove and broadcast that user left
     RoomManager.getInstance().broadcast({
         type:"user-left",
         payload:{
            userId:this.userId
         }
     },this,this.spaceId!)
    RoomManager.getInstance().removeUser(this,this.spaceId!);
}
  

//sends sends messa
  send(payload: OutgoingMessage) {
    
    this.ws.send(JSON.stringify(payload));

  }
}
