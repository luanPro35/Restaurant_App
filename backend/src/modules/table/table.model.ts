import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "occupied", "reserved", "maintenance"],
      default: "available",
    },
    location: {
      type: String, // e.g., "Floor 1", "Garden", "VIP Room"
      default: "Main Hall",
    },
  },
  {
    timestamps: true,
  },
);

const Table = mongoose.model("Table", tableSchema);

export default Table;
