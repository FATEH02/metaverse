var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import { RoomManager } from "./RoomManager.js";
import client from "../../Db/index.js";
import jwt from "jsonwebtoken";
function getRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length)); // Fix here
    }
    return result;
  }
export class User {
  constructor(ws) {
    this.ws = ws;
    this.id = getRandomString(10); //gives random session id
    this.x = 0;
    this.y = 0;
  }




  initHandlers() {


//!listing for incoming messages
    this.ws.on("message", (data) =>
      __awaiter(this, void 0, void 0, function* () {
        var _a, _b;


        //!parsing the incoming data
        const parsedData = JSON.parse(data.toString());



       //!switch case based on incoming data
        switch (parsedData.type) {




         //!joined event 
          case "join":
            const spaceId = parsedData.payload.spaceId; //get space id from the user
            const token = parsedData.payload.token; //get roken from the ws
            const userId = jwt.verify(token, "fateh").userId; //verify the user

            console.log(`User joinded with this space id ${spaceId} and this userId ${userId}`);
            
            if (!userId) {
              console.log(`user id is not exist please send anoter`);
                this.ws.close();
                return;
            }
            
            //!check if space exists 
            const space = yield client.space.findFirst({
                where: {
                    id: spaceId,
                },
            });

            //!if space is not in the then close the connection and return 
            if (!space) {
                console.log("space dont exist please sed anotehr sapce");
                
                this.ws.close();
                return;
            }

            //!if data is validaed then save this space id in the user spaceid
            this.spaceId = spaceId; //if validaed then save space id

            //!call adduser funtion which will take space id and the current user and will insert user in that 
            RoomManager.getInstance().addUser(spaceId, this);
            //sets random x and y cordinates


            //!current user random spawn point
            this.x = Math.floor(
                Math.random() *
                (space === null || space === void 0 ? void 0 : space.width)
            );
            this.y = Math.floor(
                Math.random() *
                (space === null || space === void 0 ? void 0 : space.height)
            );
 
            console.log(`random cordintes to joing:${this.x,this.y}`);
            
            //!send user their random spawn point
            this.send({
                type: "space-joined",
              payload: {
                //TODO 
                spawn: {
                  x: this.x,
                  y: this.y,
                },
                //!also send all the other users present int that space
                users:
                  (_b =
                    (_a = RoomManager.getInstance().rooms.get(spaceId)) ===
                      null || _a === void 0
                      ? void 0
                      : _a
                          .filter((x) => x.id !== this.id)
                          .map((u) => ({ id: u.id }))) !== null && _b !== void 0
                    ? _b
                    : [],
              },
            });
            // console.log("user added to the space");
            //  console.log(spaceId);
            //  console.log(this.id);
             
            //!THEN BROadcasat to everyone about the user that user has joined the sapce
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
              this.spaceId
            );
            break;


          //! move this is move event when move enevet come 
          case "move":
            
          //!user move position will come here
            const moveX =  parsedData.payload.x;
            const moveY = parsedData.payload.y;
            
            // console.log(`current move is ${this.x} and ${this.y}`);

            console.log(`receved new position ${moveX} and ${moveY}`);

            

            //!calculate displace
            const xDisplacement = Math.abs(this.x - moveX);
            const yDisplacement = Math.abs(this.y - moveY);
            console.log(xDisplacement,yDisplacement);
            
//!check for validatin of move does this move is valid or not
    // console.log(`move is ${xDisplacement} and ${yDisplacement}`);
    
            // if (
            //   (xDisplacement == 1 && yDisplacement == 0) ||
            //   (xDisplacement == 0 && yDisplacement == 1)
            // ) {
                console.log(xDisplacement);
                
              this.x = moveX;
              this.y = moveY;
               console.log(`this x ${this.x} ${this.y}`);
               
              //!broadcast to evryone about te user move 
              RoomManager.getInstance().broadcast(
                {
                  type: "move",
                  payload: {
                    x: this.x,
                    y: this.y,
                  },
                },
                this,
                this.spaceId
              );
              return;
            // }
             console.log("rejected");
             
            //!if move is rejected then send in response that this move is rejected
            this.send({
              type: "movement-rejected",
              payload: {
                x: this.x,
                y: this.y,
              },
            });
            (this.x = moveX), (this.y = moveY);
        }
      })
    );
  }


  //!called when user is disconnected 
  destroy() {

    //!remove and broadcast that user is disconnected
    RoomManager.getInstance().broadcast(
      {
          type: "user-left",
          payload: {
              userId: this.userId,
            },
        },
        this,
        this.spaceId
    );
    console.log("user disconnected");
    RoomManager.getInstance().removeUser(this, this.spaceId);
  }
  //send user a meesage
  send(payload) {
    this.ws.send(JSON.stringify(payload));
  }
}
