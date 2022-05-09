import socketio from 'socket.io';
import { INotificationService } from "./inotification-service";

const INVALID_SOCKET_SERVER = "Invalid Socket Server Initialization Provided!";
const INVALID_ARGUMENTS = "Invalid Argument(s) Specified!";

class SocketNotificationService implements INotificationService {
    constructor(private socketIOServer: socketio.Server) {
        if (socketIOServer === null) {
            throw new Error(INVALID_SOCKET_SERVER)
        }
    }

    notify(eventName: string, payload: any): void {
        const validation = eventName !== null && payload !== null;

        if (!validation) {
            throw new Error(INVALID_ARGUMENTS);
        }

        this.socketIOServer.emit(eventName, payload);
    }
}

export {
    SocketNotificationService
};
