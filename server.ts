import { LogManager } from "./common";
import { CertificateDetails, Customer } from "./models";
import { Configuration } from "./config";
import { CustomerService } from "./business/services/customers";
import { CustomerServiceHost, IServiceHost } from "./hosting";

const INVALID_SSL_CERTIFICATE_DETAILS = "Invalid SSL Certificate Env. Details Specified!";
const DEFAULT_PASS_PHRASE = "";

class MainClass {
    static main(): void {
        try {
            let host: IServiceHost;

            const settings = Configuration.getConfiguration();
            const enableHttps = settings?.enableHttps;
            const portNumber = settings?.portNumber;

            if (enableHttps) {
                const certFile = settings?.certFile;

                if (!certFile) {
                    throw new Error(INVALID_SSL_CERTIFICATE_DETAILS);
                }

                const keyFile = settings?.keyFile;

                if (!keyFile) {
                    throw new Error(INVALID_SSL_CERTIFICATE_DETAILS);
                }

                const passphrase = settings?.passphrase || DEFAULT_PASS_PHRASE;
                const certificateDetails = new CertificateDetails(keyFile, certFile, passphrase);

                host = new CustomerServiceHost(portNumber, enableHttps, certificateDetails);
            } else {
                host = new CustomerServiceHost(portNumber, enableHttps);
            }

            host.start()
                .then(() => LogManager.info("Customer Service Host Started Successfully!"),
                    () => LogManager.error("Unable to Start the Customer Service Host!"));

            const shutdown = () => {
                host.stop()
                    .then(
                        () => LogManager.info("Customer Service Host Stopped Successfully!"),
                        () => LogManager.error("Unable to Stop the Customer Service Host"!));
            };

            process.on('exit', shutdown);
            process.on('SIGINT', shutdown);
        } catch (error) {
            LogManager.error(error);
        }
    }
}

MainClass.main();