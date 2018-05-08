const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fxhsb');

let Data;

const DataSchema = new mongoose.Schema({
    humanity: Number,
    temperature: Number,
    luminance: Number,
    moisture: Number,
}, {
    timestamps: true,
});

Data = mongoose.model('Data', DataSchema);

module.exports = Data;
