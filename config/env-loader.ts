import dotenv from 'dotenv';
import path from 'path';
import { LogManager } from '../common';

const INVALID_ENVIRONMENT = "Invalid Environment Name Specified!";

const loadConfiguration = (environment: string) => {
    const validation = environment === null;

    if (validation) {
        throw new Error(INVALID_ENVIRONMENT);
    }

    const environmentFile = path.resolve(`${process.cwd()}/environments/${environment}.env`);

    LogManager.info(`Currently Loading Env. Variables from ... ${environment} ... ${environmentFile}`);

    dotenv.config({
        path: environmentFile
    });
};

export {
    loadConfiguration
};
