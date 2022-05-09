"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerServiceHost = void 0;
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const socket_io_1 = __importDefault(require("socket.io"));
const express_jwt_1 = __importDefault(require("express-jwt"));
const morgan_1 = __importDefault(require("morgan"));
const routing_1 = require("../routing");
const common_1 = require("../common");
const utilities_1 = require("../utilities");
const notifications_1 = require("../business/services/notifications");
const customers_1 = require("../business/services/customers");
const userprofile_1 = require("../business/services/userprofile");
const authentication_1 = require("../business/services/authentication");
const constants_1 = require("../constants");
const config_1 = require("../config");
const CONNECT_EVENT = "connection";
const DISCONNECT_EVENT = "disconnect";
const INVALID_CERTIFICATE_DETAILS = "Invalid SSL Certificate Details Provided!";
const CUSTOMERS_API = "/api/customers";
const AUTHENTICATION_API = "/authenticate";
const PUBLIC_ROOT = "/";
class CustomerServiceHost {
    constructor(portNumber, httpsEnabled, certificateDetails) {
        this.portNumber = portNumber;
        this.application = express_1.default();
        if (httpsEnabled) {
            const validation = certificateDetails && certificateDetails.keyFile !== null &&
                certificateDetails.certFile !== null &&
                fs_1.default.existsSync(certificateDetails.keyFile) &&
                fs_1.default.existsSync(certificateDetails.certFile);
            if (!validation) {
                throw new Error(INVALID_CERTIFICATE_DETAILS);
            }
            const keyFile = (certificateDetails === null || certificateDetails === void 0 ? void 0 : certificateDetails.keyFile) || "";
            const certFile = (certificateDetails === null || certificateDetails === void 0 ? void 0 : certificateDetails.certFile) || "";
            this.webServer = https_1.default.createServer({
                key: fs_1.default.readFileSync(keyFile),
                cert: fs_1.default.readFileSync(certFile),
                passphrase: certificateDetails === null || certificateDetails === void 0 ? void 0 : certificateDetails.passphrase
            }, this.application);
        }
        else {
            this.webServer = http_1.default.createServer(this.application);
        }
        this.socketIOServer = socket_io_1.default.listen(this.webServer);
        this.customerService = new customers_1.CustomerService();
        this.notificationService = new notifications_1.SocketNotificationService(this.socketIOServer);
        this.customerRouting = new routing_1.CustomerRouting(this.customerService, this.notificationService);
        this.userProfileService = new userprofile_1.UserProfileService();
        this.authenticationService = new authentication_1.AuthenticationService();
        this.authenticationRouting = new routing_1.AuthenticationRouting(this.authenticationService, this.userProfileService);
        this.initialize();
    }
    applyCors(request, response, next) {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Methods", "*");
        response.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization, X-Requested-With");
        response.header("Access-Control-Allow-Credentials", "true");
        next();
    }
    handleUnauthorizedError(error, request, response, next) {
        if (error && error.constructor.name === "UnauthorizedError") {
            response.status(constants_1.HttpStatusCodes.UNAUTHORIZED);
            return;
        }
        next();
    }
    initialize() {
        if (this.application) {
            const settings = config_1.Configuration.getConfiguration();
            const secretKey = settings === null || settings === void 0 ? void 0 : settings.secretKey;
            this.application.use(morgan_1.default('dev'));
            this.application.use(this.applyCors);
            this.application.use(this.handleUnauthorizedError);
            this.application.use(body_parser_1.default.json());
            this.application.use(CUSTOMERS_API, express_jwt_1.default({
                secret: secretKey
            }));
            this.application.use(AUTHENTICATION_API, this.authenticationRouting.Router);
            this.application.use(CUSTOMERS_API, this.customerRouting.Router);
            this.application.use(PUBLIC_ROOT, express_1.default.static("public"));
            this.socketIOServer.on(CONNECT_EVENT, socketClient => {
                CustomerServiceHost.noOfClients++;
                socketClient.id = utilities_1.RandomGenerator.generate().toString();
                socketClient.on(DISCONNECT_EVENT, () => {
                    CustomerServiceHost.noOfClients--;
                    common_1.LogManager.info(`${socketClient.id} - DISCONNECTED ...`);
                    common_1.LogManager.info(`Totally ${CustomerServiceHost.noOfClients} Client(s) Actively Available ...`);
                });
                common_1.LogManager.info(`${socketClient.id} - CONNECTED ...`);
                common_1.LogManager.info(`Totally ${CustomerServiceHost.noOfClients} Client(s) Actively Available ...`);
            });
        }
    }
    start() {
        const promise = new Promise((resolve, reject) => {
            try {
                if (this.webServer) {
                    this.webServer.listen(this.portNumber, () => {
                        resolve(true);
                    });
                }
                else
                    reject(false);
            }
            catch (exception) {
                common_1.LogManager.error(exception);
                reject(false);
            }
        });
        return promise;
    }
    stop() {
        const promise = new Promise((resolve, reject) => {
            try {
                if (this.webServer) {
                    this.webServer.close(() => {
                        resolve(true);
                    });
                }
                else
                    reject(false);
            }
            catch (exception) {
                common_1.LogManager.error(exception);
                reject(false);
            }
        });
        return promise;
    }
}
exports.CustomerServiceHost = CustomerServiceHost;
CustomerServiceHost.noOfClients = 0;
//# sourceMappingURL=customer-service-host.js.map