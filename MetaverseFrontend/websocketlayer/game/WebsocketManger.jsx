import Phaser from 'phaser';

class WebSocketManager extends Phaser.Events.EventEmitter {
  constructor(url) {
    super(); // EventEmitter for communication
    this.socket = new WebSocket(url);

    this.socket.addEventListener('open', () => {
      console.log("✅ Connected to websocket server");
      this.emit('connected');
    });

    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    });

    this.socket.addEventListener('close', () => {
      console.log("🔌 Disconnected from the server");
      this.emit('disconnected');
    });

    this.socket.addEventListener('error', (error) => {
      console.log("❌ WebSocket error", error);
      this.emit('error', error);
    });
  }

  handleMessage(message) {
    switch (message.type) {
      case 'movement-rejected':
        this.emit('movement-rejected', message.payload);
        break;

      case 'move':
        this.emit('move', message.payload);
        break;

      default:
        console.log('Unknown message type:', message);
    }
  }

  sendMove(x, y) {
    if (this.socket.readyState === WebSocket.OPEN) {
      const positionData = {
        type: 'move',
        payload: { x, y }
      };

      this.socket.send(JSON.stringify(positionData));
    }
  }
}

export default WebSocketManager;
