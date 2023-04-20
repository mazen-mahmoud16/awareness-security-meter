import mongoose from "mongoose";

mongoose.plugin((schema) => {
  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });
});
