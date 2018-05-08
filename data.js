const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fxhsb');

let Data;

const DataSchema = new mongoose.Schema({
    humanity: Number,
    luminance: Number,
    temperature: Number,
    moisture: Number,
}, {
    timestamps: true,
});

Data = mongoose.model('Data', DataSchema);

module.exports = Data;
