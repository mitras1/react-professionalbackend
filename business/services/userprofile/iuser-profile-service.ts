import { UserProfile } from "../../../models/user-profile";

interface IUserProfileService {
    getUserProfiles(): Promise<UserProfile[] | null>;
    getUserProfile(userProfileId: string): Promise<UserProfile | null>;
}

export {
    IUserProfileService
};
