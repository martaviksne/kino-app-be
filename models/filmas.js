// Vajadzīgās pakotnes
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Filmas Datu modeļa shēma
var seanssSchema = new mongoose.Schema({
    date: Date,
    place: Number,
    price: Number
});

// Filmas Datu modeļa shēma
var movieSchema = new mongoose.Schema({
    name: String,
    description: String,
    director: String,
    genre: String,
    poster: String,
    seansi: [seanssSchema]
});

// Atgriežam datu modeļus
module.exports = restful.model('filma', movieSchema);
