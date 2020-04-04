import mongoose from "mongoose";

mongoose.connect(
  process.env.TM_MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => console.log("Connected to MongoDB")
);
