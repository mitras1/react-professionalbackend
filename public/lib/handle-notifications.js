const socketIOUrl =
    window.location.protocol + "//" +
    window.location.hostname + ":" +
    window.location.port + "/";

const socketClient = io.connect(socketIOUrl);

if (socketClient === null) {
    console.error("Unable to establish a conncetion with Socket IO Server!");
} else {
    socketClient.on('NewCustomerRecord',
        message => {
            console.info('New Customer Record Event Handled ... ' +
                JSON.stringify(message));
        });
}
