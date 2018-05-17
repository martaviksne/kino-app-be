var mongoose = require('mongoose');
var restful = require('node-restful');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var SubscriberSchema = new mongoose.Schema({
    subscription: String
});

module.exports = restful.model('subscriber', SubscriberSchema);
