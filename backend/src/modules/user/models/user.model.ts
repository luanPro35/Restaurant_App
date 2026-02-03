import mongoose from "mongoose";
// import validator from 'validator';
// import bcrypt from 'bcryptjs';
// import toJSON from '../toJSON/toJSON.plugin';
// import paginate from '../paginate/paginate.plugin';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      // validate(value) {
      //   if (!validator.isEmail(value)) {
      //     throw new Error('Invalid email');
      //   }
      // },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: ["user", "admin", "staff"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

// userSchema.plugin(toJSON);
// userSchema.plugin(paginate);

const User = mongoose.model("User", userSchema);

export default User;
