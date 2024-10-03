import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String, required: true },
  foodSpecialties: { type: String },
  tips: { type: String }
});

const commentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const travelPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    itinerary: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    estimatedCost: { 
      amount: { type: Number, required: true },
      currency: { type: String, required: true }
    },
    travelType: { type: String, required: true },
    author: { type: String, required: true },
    coverImage: { type: String, required: true },
    cities: [citySchema],
    comments: [commentSchema]
  },
  {
    timestamps: true
  }
);

const TravelPost = mongoose.model("TravelPost", travelPostSchema);

export default TravelPost;