interface INotificationService {
    notify(eventName: string, payload: any): void;
}

export {
    INotificationService
};
