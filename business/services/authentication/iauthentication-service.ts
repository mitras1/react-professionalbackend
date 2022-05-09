import { UserProfile } from "../../../models/user-profile";

interface IAuthenticationService {
    authenticate(userProfileId: string, password: string): Promise<boolean>;
    generateToken(userProfile: UserProfile): Promise<string>;
};

export {
    IAuthenticationService
};
