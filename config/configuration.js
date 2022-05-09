"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = void 0;
const env_loader_1 = require("./env-loader");
const DEFAULT_MONGO_SERVER = "localhost";
const DEFAULT_MONGO_PORT = 27017;
const DEFAULT_MONGO_DB = "reacttrainingdb";
const DEFAULT_SECRET_KEY = "Microsoft";
const DEFAULT_EXPIRY_PERIOD = "10m";
const DEFAULT_ENVIRONMENT = "development";
const DEFAULT_PORT_NUMBER = 8080;
class Configuration {
    static getConfiguration() {
        if (Configuration.configurationSettings === null) {
            const environment = process.env.ENVIRONMENT || DEFAULT_ENVIRONMENT;
            env_loader_1.loadConfiguration(environment);
            let connectionString = process.env.MONGO_CONNECTION_STRING;
            if (!connectionString) {
                const mongoServer = process.env.MONGO_SERVER || DEFAULT_MONGO_SERVER;
                const mongoPort = process.env.MONGO_PORT || DEFAULT_MONGO_PORT;
                const mongoDbName = process.env.MONGO_DB || DEFAULT_MONGO_DB;
                connectionString = `mongodb://${mongoServer}:${mongoPort}/${mongoDbName}`;
            }
            const secretKey = process.env.SECRET_KEY || DEFAULT_SECRET_KEY;
            const expiryPeriod = process.env.EXPIRY_PERIOD || DEFAULT_EXPIRY_PERIOD;
            const portNumber = parseInt(process.env.LISTENER_PORT || "") || DEFAULT_PORT_NUMBER;
            const enableHttps = (process.env.ENABLE_HTTPS || "") === "true";
            const certFile = process.env.CERT_FILE;
            const keyFile = process.env.KEY_FILE;
            const passphrase = process.env.PASS_PHRASE;
            Configuration.configurationSettings = {
                getConnectionString: () => connectionString,
                secretKey,
                expiryPeriod,
                portNumber,
                enableHttps,
                certFile,
                keyFile,
                passphrase
            };
        }
        return Configuration.configurationSettings;
    }
}
exports.Configuration = Configuration;
Configuration.configurationSettings = null;
//# sourceMappingURL=configuration.js.map