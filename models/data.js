var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DataSchema = new Schema(
  {
    serialNumber: {type: String, required: true, maxlength: 150 },
    PilotName: {type: String, required: true, maxlength: 200},
    PilotEmail: {type: String, required: true, maxlength: 200},
    PilotPhone: {type: String, required: true, maxlength: 200},
    Posx: {type: Number, required: true},
    Posy: {type: Number, required: true},
    Violations: {type: String, required: true, maxlength: 200},
    Nearest: {type: String, required: true, maxlength: 200},
    NumberOfViolations: {type: Number, required: true}
  },
  { timestamps: true });

//Export model
module.exports = mongoose.model('Data', DataSchema);