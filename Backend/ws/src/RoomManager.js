export class RoomManager {
    constructor() {
        this.rooms = new Map();
        this.rooms = new Map();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance;
    }


    //!remoe user from the spae user and space id will coe here
    removeUser(user, spaceId) {
        var _a, _b;
        if (!this.rooms.has(spaceId)) {
            return;
        }
        this.rooms.set(spaceId, (_b = (_a = this.rooms.get(spaceId)) === null || _a === void 0 ? void 0 : _a.filter((u) => u.id !== user.id)) !== null && _b !== void 0 ? _b : []);
    }


    //!add user to the space spaceid and user will come here
    addUser(spaceId, user) {
        var _a;
        if (!this.rooms.has(spaceId)) {
            this.rooms.set(spaceId, [user]);
            return;
        }
        this.rooms.set(spaceId, [...((_a = this.rooms.get(spaceId)) !== null && _a !== void 0 ? _a : []), user]);
    }


    //!broadcasat the meesage to take input meesage user and roomid
    broadcast(message, user, roomId) {
        var _a;
        if (!this.rooms.has(roomId)) {
            return;
        }
        (_a = this.rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.forEach((u) => {
            if (u.id !== user.id) {
                u.send(message);
            }
        });
    }
}
