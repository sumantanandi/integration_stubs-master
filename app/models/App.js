var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// simple schema to capture a remote app registration for security
// purposes.
//
var appSchema = new Schema({
  type: { type: String, default: 'App' },
  id: { type: String, required: true, unique: true },
  content: String,
  notificationType: String,
  partnerCode: String,
  createdAt: Date,
  updatedAt: Date
});

// covert property names on conversion

appSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

// expose the model for module users

// var App = mongoose.model('App', appSchema);

// also create a hook to add house keeping information

appSchema.pre('save', function(next) {
  var app = this;

  var currentDate = new Date();

  app.updatedAt = currentDate;
  if (!app.createdAt) {
    app.createdAt = currentDate;
  }

  next();
});

// module.exports = App;
