import { User } from "./User.js";
import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 3000 });
wss.on('connection', function connection(ws) {
    console.log("connected");
    
    const user = new User(ws); // Move here
    user.initHandlers();
    ws.on('close', () => {
        user.destroy();
    });
});
