//Handles cross websocket communication, communicates with Mongo, data storage
const crypto = require('crypto');
function genUuid(){
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b=>(b^crypto.rng(1)[0]%16>>b/4).toString(16));
}
const createFactory = require('./factory');
const Mongo = require('./mongo');
class LiveUpdate {

    constructor() {
        this.data = {
            webSockets: new Map() //Map of websockets for each individual connection
        }
    }

    sendToAllWs(message) {
        //Use destructuring for map iteration
        message = JSON.stringify(message);
        for (let [,ws] of this.data.webSockets)
            ws.send(message);

        // this.data.webSockets.forEach((item) => {
        //     item[1].send(message);
        // })
    }

    //add websocket to map
    addWs(ws){
        if (Mongo.isConnected()) {
            const uuid = genUuid();
            this.data.webSockets.set(uuid, ws);
            this.handleWs(uuid,ws);
            Mongo.getAllFactories().then((factories) => {
                ws.send(JSON.stringify({
                    event: "update",
                    factories
                }));
            }).catch((err) => {
                ws.send(JSON.stringify({
                    "event": "error",
                    "desc": err
                }));
            });
        } else {
            Mongo.connect().then(()=> {
                const uuid = genUuid();
                this.data.webSockets.set(uuid, ws);
                this.handleWs(uuid,ws);
                Mongo.getAllFactories().then((factories) => {
                    ws.send(JSON.stringify({
                        event: "update",
                        factories
                    }));
                }).catch((err) => {
                    ws.send(JSON.stringify({
                        "event": "error",
                        "desc": err
                    }));
                });
            });
        }
    }

    //remove websocket from map
    removeWs(uuid){
        this.data.webSockets.delete(uuid);
        if (this.data.webSockets.size === 0)
            Mongo.disconnect();
    }


    handleWs(uuid, ws){
        ws.on('message', (message) => {
            message = JSON.parse(message);
            switch(message.event) {

                case "createFactory":
                    Mongo.updateFactory(createFactory(genUuid(), message)).then(() => {
                        Mongo.getAllFactories().then((factories) => {
                            this.sendToAllWs({
                                event: "update",
                                factories
                            });
                        }).catch((err) => {
                            ws.send(JSON.stringify({
                                "event": "error",
                                "desc": err
                            }));
                        });
                    }).catch((err) => {
                        ws.send(JSON.stringify({
                            "event": "error",
                            "desc": err
                        }));
                    });
                    break;
                case "removeFactory":
                    Mongo.removeFactory(message.uid).then(() => {
                        Mongo.getAllFactories().then((factories) => {
                            this.sendToAllWs({
                                event: "update",
                                factories
                            });
                        }).catch((err) => {
                            ws.send(JSON.stringify({
                                "event": "error",
                                "desc": err
                            }));
                        });
                    }).catch((err) => {
                        ws.send(JSON.stringify({
                            "event": "error",
                            "desc": err
                        }));
                    });
                    break;
                case "updateFactory":
                    Mongo.updateFactory(message).then(() => {
                        Mongo.getAllFactories().then((factories) => {
                            this.sendToAllWs({
                                event: "update",
                                factories
                            });
                        }).catch((err) => {
                            ws.send(JSON.stringify({
                                "event": "error",
                                "desc": err
                            }));
                        });
                    }).catch((err) => {
                        ws.send(JSON.stringify({
                            "event": "error",
                            "desc": err
                        }));
                    });
                    break;
                default:
                    ws.send(JSON.stringify({
                        "event": "error",
                        "desc": "You broke it"
                    }))
            }

        });

        ws.on('close', () => {
            //Logic goes here
            this.removeWs(uuid);
        });
    }

}

//Done to have only a single instance of this class
module.exports = new LiveUpdate();