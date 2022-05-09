import { ObjectFormatter } from "../utilities";

class UserProfile {
    constructor(public userProfileId: string, public password: string,
        public email: string, public department: string, public title: string) { }

    toString() {
        return ObjectFormatter.format(this);
    }
}

export {
    UserProfile
};
