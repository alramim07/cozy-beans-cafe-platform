// SiteSettings - single document holding ALL editable site content.
// Auto-created with defaults if missing (see SiteSettings.getSettings()).
const mongoose = require('mongoose');

// One row per day: Monday - Sunday
const hourSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    open: { type: String, default: '09:00' }, // "07:00"
    close: { type: String, default: '20:00' }, // "20:00"
    isClosed: { type: Boolean, default: false },
  },
  { _id: false }
);

// Optional extra social link (e.g. TikTok, YouTube)
const extraLinkSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, maxlength: 40 },
    url: { type: String, trim: true, maxlength: 500 },
  },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    // --- Branding ---
    cafeName: { type: String, trim: true, maxlength: 80, default: 'Olive & Oak' },
    tagline: { type: String, trim: true, maxlength: 160, default: 'Fresh food, warm drinks, friendly faces.' },
    logo: { type: String, default: '' },

    // --- Home page hero ---
    hero: {
      eyebrow: { type: String, trim: true, maxlength: 80, default: 'Est. 2020 • Downtown' },
      heading: { type: String, trim: true, maxlength: 200, default: 'Fresh food, warm drinks, friendly faces.' },
      subheading: {
        type: String,
        trim: true,
        maxlength: 500,
        default: 'A cozy neighborhood café serving hearty breakfasts, light lunches, and hand-crafted coffee — made fresh every day for students, workers, and families.',
      },
      buttonText: { type: String, trim: true, maxlength: 60, default: 'View Our Menu' },
      backgroundImage: { type: String, default: '' },
    },

    // --- Short description on the home page ---
    description: { type: String, trim: true, maxlength: 1000, default: '' },

    // --- Contact details (shown on Contact page + Footer) ---
    contact: {
      phone: { type: String, trim: true, maxlength: 40, default: '+1 (555) 123-4567' },
      email: { type: String, trim: true, lowercase: true, maxlength: 120, default: 'hello@oliveandoak.cafe' },
      address: { type: String, trim: true, maxlength: 200, default: '123 Main Street, Downtown' },
      googleMapsEmbedUrl: { type: String, trim: true, maxlength: 1000, default: '' },
    },

    // --- Opening hours, one entry per day ---
    openingHours: {
      type: [hourSchema],
      default: () => [
        { day: 'Monday', open: '07:00', close: '20:00', isClosed: false },
        { day: 'Tuesday', open: '07:00', close: '20:00', isClosed: false },
        { day: 'Wednesday', open: '07:00', close: '20:00', isClosed: false },
        { day: 'Thursday', open: '07:00', close: '20:00', isClosed: false },
        { day: 'Friday', open: '07:00', close: '20:00', isClosed: false },
        { day: 'Saturday', open: '08:00', close: '21:00', isClosed: false },
        { day: 'Sunday', open: '08:00', close: '21:00', isClosed: false },
      ],
    },

    // --- Social links ---
    socialLinks: {
      facebook: { type: String, trim: true, maxlength: 500, default: '' },
      instagram: { type: String, trim: true, maxlength: 500, default: '' },
      twitter: { type: String, trim: true, maxlength: 500, default: '' },
      extras: { type: [extraLinkSchema], default: [] },
    },

    // --- Footer ---
    footerText: { type: String, trim: true, maxlength: 500, default: 'Fresh food, warm drinks, friendly faces.' },
    copyrightText: { type: String, trim: true, maxlength: 200, default: '© Olive & Oak Café. All rights reserved.' },

    // --- SEO (page title + meta description) ---
    seo: {
      metaTitle: { type: String, trim: true, maxlength: 70, default: 'Olive & Oak Café' },
      metaDescription: {
        type: String,
        trim: true,
        maxlength: 160,
        default: 'A cozy neighborhood café serving fresh breakfasts, light lunches, and hand-crafted coffee.',
      },
    },
  },
  { timestamps: true }
);

// Returns the single settings document, creating it with defaults on first use.
siteSettingsSchema.statics.getSettings = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
