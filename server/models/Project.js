import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: String,
    githubUrl: { type: String, required: true },
    demoUrl: String,
    technologies: [String],
    year: String,
    coverImage: { url: String, publicId: String },
    gallery: [{ url: String, publicId: String, caption: String }],
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export default mongoose.model("Project", schema);
