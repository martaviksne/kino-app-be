var mongoose = require('mongoose');
var restful = require('node-restful');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var TicketSchema = new mongoose.Schema({
    date: Date,
    place: Number,
    price: Number,
    seats: Number,
    theId: String,
    seanss: ObjectId,
    movie: ObjectId,
    buyDate: String,
    valid: Boolean
});

module.exports = restful.model('ticket', TicketSchema);
