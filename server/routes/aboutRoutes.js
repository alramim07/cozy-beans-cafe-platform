// About page content routes: public GET + admin PUT
const router = require('express').Router();
const AboutContent = require('../models/AboutContent');
const auth = require('../middleware/auth');

// Only allow http(s) URLs or relative paths (e.g. /uploads/x.jpg)
const isUrl = (v) => /^(https?:\/\/\S+|\/\S*)$/.test(v);

// Validate only the fields that were sent
function validateAbout(body) {
  const errors = [];
  if (body.storyImage && !isUrl(body.storyImage)) {
    errors.push('Story image must be a valid URL.');
  }
  if (body.valueCards !== undefined) {
    if (!Array.isArray(body.valueCards)) {
      errors.push('Value cards must be a list.');
    } else {
      body.valueCards.forEach((card, i) => {
        if (!card.title || !String(card.title).trim())
          errors.push(`Value card ${i + 1} needs a title.`);
        if (!card.description || !String(card.description).trim())
          errors.push(`Value card ${i + 1} needs a description.`);
      });
    }
  }
  return errors;
}

// GET /api/about - public
router.get('/', async (req, res, next) => {
  try {
    const content = await AboutContent.getContent();
    // Always return value cards in a stable display order
    const sorted = content.toObject();
    sorted.valueCards = [...(sorted.valueCards || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json(sorted);
  } catch (err) {
    next(err);
  }
});

// PUT /api/about - admin only (partial update)
router.put('/', auth, async (req, res, next) => {
  try {
    const errors = validateAbout(req.body || {});
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(' ') });
    }

    const content = await AboutContent.getContent();

    const allowed = ['storyEyebrow', 'storyHeading', 'storySubheading', 'storyText', 'storyImage', 'valueCards'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) content[key] = req.body[key];
    }

    await content.save();
    res.json(content);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msgs = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: msgs.join(' ') });
    }
    next(err);
  }
});

module.exports = router;
