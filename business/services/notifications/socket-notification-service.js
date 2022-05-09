"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketNotificationService = void 0;
const INVALID_SOCKET_SERVER = "Invalid Socket Server Initialization Provided!";
const INVALID_ARGUMENTS = "Invalid Argument(s) Specified!";
class SocketNotificationService {
    constructor(socketIOServer) {
        this.socketIOServer = socketIOServer;
        if (socketIOServer === null) {
            throw new Error(INVALID_SOCKET_SERVER);
        }
    }
    notify(eventName, payload) {
        const validation = eventName !== null && payload !== null;
        if (!validation) {
            throw new Error(INVALID_ARGUMENTS);
        }
        this.socketIOServer.emit(eventName, payload);
    }
}
exports.SocketNotificationService = SocketNotificationService;
//# sourceMappingURL=socket-notification-service.js.map