  import {User} from "./User.js"
  import { WebSocketServer } from 'ws';

  const wss = new WebSocketServer({ port: 3000 });

  wss.on('connection', function connection(ws) {
    
    //!listen to incoming websocket connections and ever connection make a new user 
    
    const user = new User(ws); 
      user.initHandlers();
      
      ws.on('close', () => {
        user.destroy();
      });
    });
    