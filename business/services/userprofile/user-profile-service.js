"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileService = void 0;
const user_profile_1 = require("../../../models/user-profile");
const INVALID_ARGUMENTS = "Invalid Argument(s) Specified!";
const USER_PROFILE_NOT_FOUND = "User Profile Not Found!";
class UserProfileService {
    getUserProfiles() {
        const promise = new Promise((resolve, reject) => {
            resolve(UserProfileService.userProfiles);
        });
        return promise;
    }
    getUserProfile(userProfileId) {
        const validation = userProfileId !== null;
        if (!validation) {
            throw new Error(INVALID_ARGUMENTS);
        }
        const promise = new Promise((resolve, reject) => {
            let filteredUserProfile = null;
            for (const profile of UserProfileService.userProfiles) {
                if (profile.userProfileId === userProfileId) {
                    filteredUserProfile = profile;
                    break;
                }
            }
            if (filteredUserProfile !== null) {
                resolve(filteredUserProfile);
            }
            else {
                reject(USER_PROFILE_NOT_FOUND);
            }
        });
        return promise;
    }
}
exports.UserProfileService = UserProfileService;
UserProfileService.userProfiles = [
    new user_profile_1.UserProfile("USRPRF000111", "Prestige", "userprofile11@email.com", "IT", "Executive"),
    new user_profile_1.UserProfile("USRPRF000112", "Prestige", "userprofile12@email.com", "IT", "Executive"),
    new user_profile_1.UserProfile("USRPRF000113", "Prestige", "userprofile13@email.com", "HR", "Executive"),
    new user_profile_1.UserProfile("USRPRF000114", "Prestige", "userprofile14@email.com", "IT", "Executive"),
    new user_profile_1.UserProfile("USRPRF000115", "Prestige", "userprofile15@email.com", "Marketing", "Executive"),
    new user_profile_1.UserProfile("USRPRF000116", "Prestige", "userprofile16@email.com", "IT", "Executive")
];
//# sourceMappingURL=user-profile-service.js.map