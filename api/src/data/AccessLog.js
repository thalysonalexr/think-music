import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const AccessLogSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  host: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  browser: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  uri: {
    type: String,
    required: true,
  },
  http: {
    type: String,
    required: true,
  }
});

AccessLogSchema.plugin(mongoosePaginate);

export default model('AccessLog', AccessLogSchema);
