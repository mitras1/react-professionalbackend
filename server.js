"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const models_1 = require("./models");
const config_1 = require("./config");
const hosting_1 = require("./hosting");
const INVALID_SSL_CERTIFICATE_DETAILS = "Invalid SSL Certificate Env. Details Specified!";
const DEFAULT_PASS_PHRASE = "";
class MainClass {
    static main() {
        try {
            let host;
            const settings = config_1.Configuration.getConfiguration();
            const enableHttps = settings === null || settings === void 0 ? void 0 : settings.enableHttps;
            const portNumber = settings === null || settings === void 0 ? void 0 : settings.portNumber;
            if (enableHttps) {
                const certFile = settings === null || settings === void 0 ? void 0 : settings.certFile;
                if (!certFile) {
                    throw new Error(INVALID_SSL_CERTIFICATE_DETAILS);
                }
                const keyFile = settings === null || settings === void 0 ? void 0 : settings.keyFile;
                if (!keyFile) {
                    throw new Error(INVALID_SSL_CERTIFICATE_DETAILS);
                }
                const passphrase = (settings === null || settings === void 0 ? void 0 : settings.passphrase) || DEFAULT_PASS_PHRASE;
                const certificateDetails = new models_1.CertificateDetails(keyFile, certFile, passphrase);
                host = new hosting_1.CustomerServiceHost(portNumber, enableHttps, certificateDetails);
            }
            else {
                host = new hosting_1.CustomerServiceHost(portNumber, enableHttps);
            }
            host.start()
                .then(() => common_1.LogManager.info("Customer Service Host Started Successfully!"), () => common_1.LogManager.error("Unable to Start the Customer Service Host!"));
            const shutdown = () => {
                host.stop()
                    .then(() => common_1.LogManager.info("Customer Service Host Stopped Successfully!"), () => common_1.LogManager.error("Unable to Stop the Customer Service Host"));
            };
            process.on('exit', shutdown);
            process.on('SIGINT', shutdown);
        }
        catch (error) {
            common_1.LogManager.error(error);
        }
    }
}
MainClass.main();
//# sourceMappingURL=server.js.map