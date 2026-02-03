import mongoose from "mongoose";

const orderStatus = {
  PENDING: "pending", // Just created
  CONFIRMED: "confirmed", // Restaurant confirmed
  COOKING: "cooking", // Kitchen is preparing
  SERVED: "served", // Food delivered to table
  COMPLETED: "completed", // Paid and finished
  CANCELLED: "cancelled",
};

const orderType = {
  DINE_IN: "dine_in",
  TAKEAWAY: "takeaway",
  DELIVERY: "delivery",
};

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      // Required only if type is dine_in
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String, // Snapshot of product name
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        variant: {
          type: String, // Optional variant name selected
        },
        note: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(orderStatus),
      default: orderStatus.PENDING,
    },
    type: {
      type: String,
      enum: Object.values(orderType),
      default: orderType.DINE_IN,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    note: {
      type: String,
    },
    deliveryAddress: {
      type: String, // Only for delivery
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
