"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfiguration = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const common_1 = require("../common");
const INVALID_ENVIRONMENT = "Invalid Environment Name Specified!";
const loadConfiguration = (environment) => {
    const validation = environment === null;
    if (validation) {
        throw new Error(INVALID_ENVIRONMENT);
    }
    const environmentFile = path_1.default.resolve(`${process.cwd()}/environments/${environment}.env`);
    common_1.LogManager.info(`Currently Loading Env. Variables from ... ${environment} ... ${environmentFile}`);
    dotenv_1.default.config({
        path: environmentFile
    });
};
exports.loadConfiguration = loadConfiguration;
//# sourceMappingURL=env-loader.js.map