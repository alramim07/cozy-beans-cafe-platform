// AboutContent - single document for the About page (story + value cards).
// Auto-created with defaults if missing (see AboutContent.getContent()).
const mongoose = require('mongoose');

// One value card: Fresh Ingredients, Community, etc.
const valueCardSchema = new mongoose.Schema(
  {
    icon: { type: String, trim: true, maxlength: 10, default: '☕' }, // emoji used as the icon
    title: { type: String, trim: true, maxlength: 80, required: true },
    description: { type: String, trim: true, maxlength: 400, required: true },
    order: { type: Number, default: 0 }, // controls display order
  },
  { _id: true }
);

const aboutContentSchema = new mongoose.Schema(
  {
    storyEyebrow: { type: String, trim: true, maxlength: 60, default: 'Our Story' },
    storyHeading: { type: String, trim: true, maxlength: 200, default: 'Where It All Began' },
    storySubheading: { type: String, trim: true, maxlength: 300, default: 'A corner shop with one espresso machine and a big idea.' },
    storyText: {
      type: String,
      trim: true,
      maxlength: 4000,
      default:
        "Olive & Oak started as a small corner shop with one espresso machine and a big idea.\n\nThe name comes from the two trees outside our first storefront — olive for the food we love to cook, oak for the sturdy community we wanted to build.\n\nToday we're still family-run, still making everything fresh from scratch, and still happy to see you walk through the door.",
    },
    storyImage: { type: String, default: '' },
    valueCards: {
      type: [valueCardSchema],
      default: () => [
        { icon: '🌱', title: 'Fresh Ingredients', description: 'We source produce daily from local farms and prepare everything from scratch each morning.', order: 0 },
        { icon: '🤝', title: 'Community', description: 'A warm, welcoming space where students, neighbors, and friends can gather and connect.', order: 1 },
        { icon: '🛋️', title: 'Comfort', description: 'From the coffee to the chairs, everything is chosen so you feel right at home.', order: 2 },
        { icon: '♻️', title: 'Sustainability', description: 'Compostable packaging, fair-trade coffee, and a small footprint we work hard to keep smaller.', order: 3 },
      ],
    },
  },
  { timestamps: true }
);

// Returns the single About document, creating it with defaults on first use.
aboutContentSchema.statics.getContent = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model('AboutContent', aboutContentSchema);
