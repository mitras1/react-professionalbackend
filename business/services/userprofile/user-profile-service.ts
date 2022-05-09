import { UserProfile } from "../../../models/user-profile";
import { IUserProfileService } from "./iuser-profile-service";

const INVALID_ARGUMENTS = "Invalid Argument(s) Specified!";
const USER_PROFILE_NOT_FOUND = "User Profile Not Found!";

class UserProfileService implements IUserProfileService {
    private static userProfiles: UserProfile[] =
        [
            new UserProfile("USRPRF000111", "Prestige", "userprofile11@email.com", "IT", "Executive"),
            new UserProfile("USRPRF000112", "Prestige", "userprofile12@email.com", "IT", "Executive"),
            new UserProfile("USRPRF000113", "Prestige", "userprofile13@email.com", "HR", "Executive"),
            new UserProfile("USRPRF000114", "Prestige", "userprofile14@email.com", "IT", "Executive"),
            new UserProfile("USRPRF000115", "Prestige", "userprofile15@email.com", "Marketing", "Executive"),
            new UserProfile("USRPRF000116", "Prestige", "userprofile16@email.com", "IT", "Executive")
        ];

    getUserProfiles(): Promise<UserProfile[] | null> {
        const promise = new Promise<UserProfile[] | null>(
            (resolve, reject) => {
                resolve(UserProfileService.userProfiles);
            });

        return promise;
    }

    getUserProfile(userProfileId: string): Promise<UserProfile | null> {
        const validation = userProfileId !== null;

        if (!validation) {
            throw new Error(INVALID_ARGUMENTS);
        }

        const promise = new Promise<UserProfile | null>(
            (resolve, reject) => {
                let filteredUserProfile: UserProfile | null = null;

                for (const profile of UserProfileService.userProfiles) {
                    if (profile.userProfileId === userProfileId) {
                        filteredUserProfile = profile;
                        break;
                    }
                }

                if (filteredUserProfile !== null) {
                    resolve(filteredUserProfile);
                } else {
                    reject(USER_PROFILE_NOT_FOUND);
                }
            });

        return promise;
    }
}

export {
    UserProfileService
};
