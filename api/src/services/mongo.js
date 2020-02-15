const mongoose = require('mongoose');

mongoose.connect(process.env.TM_MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, () => console.log('Connected to MongoDB'));
