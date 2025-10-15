import mongoose, { Document, Schema } from "mongoose";

export interface ITax extends Document {
  name: string;
  percentage: number;
  isDefault: boolean;
}

const taxSchema: Schema = new Schema(
  {
    name: { type: String, required: true, default: "Standard Tax" },
    percentage: { type: Number, required: true, default: 15 },
    isDefault: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Tax = mongoose.model<ITax>("Tax", taxSchema);
export default Tax;
