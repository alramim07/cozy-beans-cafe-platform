// Site settings routes: public GET + admin PUT
const router = require('express').Router();
const SiteSettings = require('../models/SiteSettings');
const auth = require('../middleware/auth');

// Basic validators -------------------------------------------------------
const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v);
// Accepts http(s) URLs or relative paths (for uploaded images)
const isUrl = (v) => /^(https?:\/\/\S+|\/\S*)$/.test(v);
// Accepts things like "+1 (555) 123-4567" or "555-1234"
const isPhone = (v) => /^[0-9+()\-.\s]{6,30}$/.test(v);
// "HH:MM" 24-hour time
const isTime = (v) => /^([01]\d|2[0-3]):[0-5]\d$/.test(v);

/**
 * Validate only the fields that were actually sent in the body.
 * Returns an array of error messages (empty array = valid).
 */
function validateSettings(body) {
  const errors = [];
  const { contact, hero, seo, openingHours, socialLinks } = body;

  if (contact) {
    if (contact.email !== undefined && contact.email && !isEmail(contact.email))
      errors.push('Contact email is not valid.');
    if (contact.phone !== undefined && contact.phone && !isPhone(contact.phone))
      errors.push('Phone number contains invalid characters.');
    if (contact.googleMapsEmbedUrl !== undefined && contact.googleMapsEmbedUrl && !isUrl(contact.googleMapsEmbedUrl))
      errors.push('Google Maps embed URL must start with http:// or https://.');
  }

  if (hero && hero.backgroundImage && !isUrl(hero.backgroundImage))
    errors.push('Hero background image must be a valid URL.');

  if (body.logo && !isUrl(body.logo)) errors.push('Logo must be a valid URL.');

  if (seo) {
    if (seo.metaTitle && seo.metaTitle.length > 70)
      errors.push('Meta title must be 70 characters or fewer.');
    if (seo.metaDescription && seo.metaDescription.length > 160)
      errors.push('Meta description must be 160 characters or fewer.');
  }

  if (openingHours) {
    if (!Array.isArray(openingHours)) {
      errors.push('Opening hours must be a list of days.');
    } else {
      openingHours.forEach((h) => {
        if (!h.day) errors.push('Each opening-hours entry needs a day.');
        if (!h.isClosed && (!isTime(h.open || '') || !isTime(h.close || '')))
          errors.push(`Invalid time for ${h.day}. Use HH:MM format (e.g. 07:00).`);
      });
    }
  }

  if (socialLinks) {
    for (const key of ['facebook', 'instagram', 'twitter']) {
      const v = socialLinks[key];
      if (v && !isUrl(v)) errors.push(`Social link (${key}) must start with http:// or https://.`);
    }
    if (Array.isArray(socialLinks.extras)) {
      socialLinks.extras.forEach((x) => {
        if (x.url && !isUrl(x.url)) errors.push(`Extra social link "${x.label || ''}" must be a valid URL.`);
      });
    }
  }

  return errors;
}

// GET /api/settings - public
router.get('/', async (req, res, next) => {
  try {
    const settings = await SiteSettings.getSettings();
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

// PUT /api/settings - admin only (partial update: only sent fields change)
router.put('/', auth, async (req, res, next) => {
  try {
    const errors = validateSettings(req.body || {});
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(' ') });
    }

    const settings = await SiteSettings.getSettings();

    // Only copy top-level keys that were sent (so a partial form
    // never wipes fields it does not manage).
    const allowed = [
      'cafeName', 'tagline', 'logo', 'hero', 'description',
      'contact', 'openingHours', 'socialLinks', 'footerText',
      'copyrightText', 'seo',
    ];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        settings[key] = req.body[key];
      }
    }

    await settings.save();
    res.json(settings);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msgs = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: msgs.join(' ') });
    }
    next(err);
  }
});

module.exports = router;
