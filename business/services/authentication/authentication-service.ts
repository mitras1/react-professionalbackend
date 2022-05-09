import { Configuration } from '../../../config';
import jwt from 'jsonwebtoken';

import { UserProfile } from "../../../models/user-profile";
import { IUserProfileService, UserProfileService } from "../userprofile";
import { IAuthenticationService } from "./iauthentication-service";

const INVALID_ARGUMENTS = "Invalid Argument(s) Specified!";
const INVALID_UESR_PROFILE = "Invalid User Profile Detail(s) Specified!";
const INVALID_SECRET_KEY = "Invalid JWT Secret Key Configuration Provided!";

class AuthenticationService implements IAuthenticationService {
    private userProfileService: IUserProfileService;

    constructor(userProfileService?: IUserProfileService) {
        this.userProfileService = userProfileService || new UserProfileService();
    }

    async authenticate(userProfileId: string, password: string): Promise<boolean> {
        const validation = userProfileId !== null && password !== null;

        if (!validation) {
            throw new Error(INVALID_ARGUMENTS);
        }

        const filteredUserProfile = await this.userProfileService.getUserProfile(userProfileId);

        if (filteredUserProfile === null) {
            throw new Error(INVALID_UESR_PROFILE);
        }

        const authenticationStatus = filteredUserProfile.userProfileId === userProfileId &&
            filteredUserProfile.password === password;

        return authenticationStatus;;
    }

    async generateToken(userProfile: UserProfile): Promise<string> {
        const validation = userProfile !== null &&
            userProfile.userProfileId !== null;

        if (!validation) {
            throw new Error(INVALID_ARGUMENTS);
        }

        const safeUserProfile: any = {
            userProfileId: userProfile.userProfileId,
            email: userProfile.email,
            title: userProfile.title,
            department: userProfile.department
        };

        const settings = Configuration.getConfiguration();
        const secretKey = settings?.secretKey;

        if (secretKey === null) {
            throw new Error(INVALID_SECRET_KEY);
        }

        const expiryPeriod = settings?.expiryPeriod;

        const signedToken = jwt.sign(safeUserProfile, secretKey, {
            expiresIn: expiryPeriod
        });

        return signedToken;
    }
}

export {
    AuthenticationService
};
