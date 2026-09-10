import mongoose from "mongoose";
const media = {
  url: String,
  fileId: String,
  publicId: String,
  resourceType: String,
  originalName: String,
};
const achievementSchema = new mongoose.Schema({
  title: String,
  type: String,
  organization: String,
  year: String,
  description: String,
  metric: String,
  link: String,
  order: {
    type: Number,
    default: 0,
  },
  published: {
    type: Boolean,
    default: true,
  },
});
const portfolioSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    profile: {
      name: { type: String, default: "Hemanth M Sirvi" },
      headline: { type: String, default: "ENGINEERING IDEAS INTO REALITY." },
      intro: {
        type: String,
        default:
          "A final-year engineering student who enjoys solving problems, building practical digital products, and continuously exploring new technologies.",
      },
      location: String,
      availability: { type: String, default: "Open to opportunities" },
      heroMode: {
        type: String,
        enum: ["animation", "image"],
        default: "animation",
      },
      heroImage: media,
    },
    about: {
      heading: {
        type: String,
        default: "CURIOUS BY NATURE. ENGINEERED FOR PROGRESS.",
      },

      bio: String,

      image: media,

      approach: {
        type: [String],
        default: ["Think", "Design", "Build", "Improve"],
      },
    },
    educations: [
      {
        institution: String,
        degree: String,
        field: String,
        period: String,
        score: String,
        description: String,
        order: Number,
        published: { type: Boolean, default: true },
      },
    ],
    experiences: [
      {
        title: String,
        company: String,
        period: String,
        description: String,
        order: Number,
        published: { type: Boolean, default: true },
      },
    ],
    techCategories: [{ name: String, items: [String], order: Number }],
    achievements: {
      type: [achievementSchema],
      default: [],
    },
    hobbies: [
      {
        name: String,
        description: String,
        image: media,
        order: Number,
        published: { type: Boolean, default: true },
      },
    ],
    contact: {
      email: String,
      phone: String,
      linkedin: String,
      github: String,
      location: String,
      formEnabled: { type: Boolean, default: true },
    },
  },
  { timestamps: true, minimize: false },
);
export default mongoose.model("Portfolio", portfolioSchema);
