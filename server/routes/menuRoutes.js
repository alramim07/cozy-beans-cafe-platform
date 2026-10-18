// Menu routes: public GET + admin CRUD
const router = require('express').Router();
const MenuItem = require('../models/MenuItem');
const auth = require('../middleware/auth');

// ----- Public routes -----
// GET /api/menu?category=breakfast
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category
      ? { category: category.toLowerCase().trim() }
      : {};
    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// GET /api/menu/popular
router.get('/popular', async (req, res, next) => {
  try {
    const items = await MenuItem.find({ popular: true }).sort({ name: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// ----- Admin-only routes (require auth) -----
// POST /api/menu - create new menu item
router.post('/', auth, async (req, res, next) => {
  try {
    const { name, description, price, category, popular, image } = req.body;
    const item = await MenuItem.create({
      name,
      description,
      price,
      category,
      popular: !!popular,
      image: image || '',
    });
    res.status(201).json(item);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msgs = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: msgs.join(' ') });
    }
    next(err);
  }
});

// PUT /api/menu/:id - update menu item
router.put('/:id', auth, async (req, res, next) => {
  try {
    const { name, description, price, category, popular, image } = req.body;
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, popular: !!popular, image },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json(item);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msgs = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: msgs.join(' ') });
    }
    next(err);
  }
});

// DELETE /api/menu/:id - delete menu item
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;