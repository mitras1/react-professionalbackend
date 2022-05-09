import express from 'express';
import { IUserProfileService, UserProfileService } from "../business/services/userprofile";
import { AuthenticationService, IAuthenticationService } from "../business/services/authentication";
import { IRouting } from "./icustomer-routing";
import { HttpStatusCodes } from '../constants';
import { LogManager } from '../common';

const INVALID_CREDENTIALS = "Invalid Credential(s) Specified!";
const AUTHENTICATION_FAILURE = "Authentication Failed!";
const UNKNOWN_ERROR = "Unknown Error Occurred, Please try again later!";

class AuthenticationRouting implements IRouting {
    private authenticationService: IAuthenticationService;
    private userProfileService: IUserProfileService;
    private router: express.Router;

    constructor(authenticationService: IAuthenticationService,
        userProfileService: IUserProfileService) {
        this.authenticationService = authenticationService || new AuthenticationService();
        this.userProfileService = userProfileService || new UserProfileService();
        this.router = express.Router();

        this.initializeRouting();
    }

    private initializeRouting() {
        this.router.post("/", async (request, response) => {
            try {
                const body = request.body;
                const userProfileId = body?.userProfileId;
                const password = body?.password;
                const validation = userProfileId !== null && password !== null;

                if (!validation) {
                    response
                        .status(HttpStatusCodes.UNAUTHORIZED)
                        .send({
                            message: INVALID_CREDENTIALS
                        });

                    return;
                }

                const authenticationStatus =
                    await this.authenticationService.authenticate(userProfileId, password);

                if (!authenticationStatus) {
                    response
                        .status(HttpStatusCodes.UNAUTHORIZED)
                        .send({
                            message: AUTHENTICATION_FAILURE
                        });

                    return;
                }

                const userProfile = await this.userProfileService.getUserProfile(userProfileId);

                if (userProfile === null) {
                    response
                        .status(HttpStatusCodes.SERVER_ERROR)
                        .send({
                            message: UNKNOWN_ERROR
                        });

                    return;
                }

                const token = await this.authenticationService.generateToken(userProfile);

                response
                    .status(HttpStatusCodes.OK)
                    .send({
                        token
                    });
            } catch (exception) {
                LogManager.error(exception);

                response
                    .status(HttpStatusCodes.SERVER_ERROR)
                    .send(exception);
            }
        });
    }

    public get Router() {
        return this.router;
    }
}

export {
    AuthenticationRouting
};
