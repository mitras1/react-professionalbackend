"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfile = void 0;
const utilities_1 = require("../utilities");
class UserProfile {
    constructor(userProfileId, password, email, department, title) {
        this.userProfileId = userProfileId;
        this.password = password;
        this.email = email;
        this.department = department;
        this.title = title;
    }
    toString() {
        return utilities_1.ObjectFormatter.format(this);
    }
}
exports.UserProfile = UserProfile;
//# sourceMappingURL=user-profile.js.map