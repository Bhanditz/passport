const MongoClient = require('mongodb').MongoClient;
const config = require('../config/config');
class Mongo {

    constructor() {
        this.data = {
            collection: undefined
        };
        this.connect();

    };

    updateFactory({uid, name, nodes}) {
        if (this.data.collection)
            if(nodes)
                return this.data.collection.updateOne({uid}, {$set:{uid, name, nodes}}, {upsert:true, w: 1});
            else
                return this.data.collection.updateOne({uid}, {$set:{uid, name}}, {upsert:true, w: 1});
        return Promise.reject("Not connected");
    };

    removeFactory(uid) {
        if (this.data.collection)
            return this.data.collection.deleteOne({uid});
        return Promise.reject("Not connected");
    };

    getAllFactories() {
        if (this.data.collection)
            return Promise.resolve(this.data.collection.find().toArray());
        return Promise.reject("Not connected");
    }

    disconnect(){
        if (this.data.client) {
            this.data.client.close();
            this.data.client = undefined;
        }
    }

    isConnected(){
        //Used to turn js Objects into boolean values
        return !!this.data.client;
    }

    connect(){
        return new Promise((resolve, reject)=> {
            MongoClient.connect(`mongodb+srv://${config.mongo.username}:${config.mongo.password}@${config.mongo.url}`, (err, client) => {
                if (err) throw err;
                this.data.client = client;
                this.data.collection = client.db('passport').collection('nodes');
                resolve();
            });
        });

    }

}

module.exports = new Mongo();