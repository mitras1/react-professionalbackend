"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationRouting = void 0;
const express_1 = __importDefault(require("express"));
const userprofile_1 = require("../business/services/userprofile");
const authentication_1 = require("../business/services/authentication");
const constants_1 = require("../constants");
const common_1 = require("../common");
const INVALID_CREDENTIALS = "Invalid Credential(s) Specified!";
const AUTHENTICATION_FAILURE = "Authentication Failed!";
const UNKNOWN_ERROR = "Unknown Error Occurred, Please try again later!";
class AuthenticationRouting {
    constructor(authenticationService, userProfileService) {
        this.authenticationService = authenticationService || new authentication_1.AuthenticationService();
        this.userProfileService = userProfileService || new userprofile_1.UserProfileService();
        this.router = express_1.default.Router();
        this.initializeRouting();
    }
    initializeRouting() {
        this.router.post("/", (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = request.body;
                const userProfileId = body === null || body === void 0 ? void 0 : body.userProfileId;
                const password = body === null || body === void 0 ? void 0 : body.password;
                const validation = userProfileId !== null && password !== null;
                if (!validation) {
                    response
                        .status(constants_1.HttpStatusCodes.UNAUTHORIZED)
                        .send({
                        message: INVALID_CREDENTIALS
                    });
                    return;
                }
                const authenticationStatus = yield this.authenticationService.authenticate(userProfileId, password);
                if (!authenticationStatus) {
                    response
                        .status(constants_1.HttpStatusCodes.UNAUTHORIZED)
                        .send({
                        message: AUTHENTICATION_FAILURE
                    });
                    return;
                }
                const userProfile = yield this.userProfileService.getUserProfile(userProfileId);
                if (userProfile === null) {
                    response
                        .status(constants_1.HttpStatusCodes.SERVER_ERROR)
                        .send({
                        message: UNKNOWN_ERROR
                    });
                    return;
                }
                const token = yield this.authenticationService.generateToken(userProfile);
                response
                    .status(constants_1.HttpStatusCodes.OK)
                    .send({
                    token
                });
            }
            catch (exception) {
                common_1.LogManager.error(exception);
                response
                    .status(constants_1.HttpStatusCodes.SERVER_ERROR)
                    .send(exception);
            }
        }));
    }
    get Router() {
        return this.router;
    }
}
exports.AuthenticationRouting = AuthenticationRouting;
//# sourceMappingURL=authentication-routing.js.map