var mongoose = require('mongoose');

var Schema = mongoose.Schema;

 var ViolationSchema = new Schema(
    {
      serialNumber: {type: String, required: true, maxlength: 150},
      Violations: {type: Number, required: true}
    });


//Export model
module.exports = mongoose.model('Violation', ViolationSchema);