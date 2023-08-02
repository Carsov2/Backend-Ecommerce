const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.route('/')
  .get(async (req, res) => {
    try {
      const allCategories = await Category.findAll({ include: [Product] });
      res.json(allCategories);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .post(async (req, res) => {
    try {
      const newCategory = await Category.create(req.body);
      res.json(newCategory);
    } catch (err) {
      res.status(500).send(err);
    }
  });

router.route('/:id')
  .get(async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id, { include: [Product] });
      if (!category) {
        return res.status(404).send('No category found with this id');
      }
      res.json(category);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .put(async (req, res) => {
    try {
      const [rowsUpdate] = await Category.update(req.body, { where: { id: req.params.id } });
      if (!rowsUpdate) {
        return res.status(404).send('No category found with this id');
      }
      res.send('Category updated successfully');
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const rowsDelete = await Category.destroy({ where: { id: req.params.id } });
      if (!rowsDelete) {
        return res.status(404).send('No category found with this id');
      }
      res.send('Category deleted successfully');
    } catch (err) {
      res.status(500).send(err);
    }
  });


module.exports = router;
