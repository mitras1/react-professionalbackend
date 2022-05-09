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
exports.AuthenticationService = void 0;
const config_1 = require("../../../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userprofile_1 = require("../userprofile");
const INVALID_ARGUMENTS = "Invalid Argument(s) Specified!";
const INVALID_UESR_PROFILE = "Invalid User Profile Detail(s) Specified!";
const INVALID_SECRET_KEY = "Invalid JWT Secret Key Configuration Provided!";
class AuthenticationService {
    constructor(userProfileService) {
        this.userProfileService = userProfileService || new userprofile_1.UserProfileService();
    }
    authenticate(userProfileId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = userProfileId !== null && password !== null;
            if (!validation) {
                throw new Error(INVALID_ARGUMENTS);
            }
            const filteredUserProfile = yield this.userProfileService.getUserProfile(userProfileId);
            if (filteredUserProfile === null) {
                throw new Error(INVALID_UESR_PROFILE);
            }
            const authenticationStatus = filteredUserProfile.userProfileId === userProfileId &&
                filteredUserProfile.password === password;
            return authenticationStatus;
            ;
        });
    }
    generateToken(userProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = userProfile !== null &&
                userProfile.userProfileId !== null;
            if (!validation) {
                throw new Error(INVALID_ARGUMENTS);
            }
            const safeUserProfile = {
                userProfileId: userProfile.userProfileId,
                email: userProfile.email,
                title: userProfile.title,
                department: userProfile.department
            };
            const settings = config_1.Configuration.getConfiguration();
            const secretKey = settings === null || settings === void 0 ? void 0 : settings.secretKey;
            if (secretKey === null) {
                throw new Error(INVALID_SECRET_KEY);
            }
            const expiryPeriod = settings === null || settings === void 0 ? void 0 : settings.expiryPeriod;
            const signedToken = jsonwebtoken_1.default.sign(safeUserProfile, secretKey, {
                expiresIn: expiryPeriod
            });
            return signedToken;
        });
    }
}
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication-service.js.map