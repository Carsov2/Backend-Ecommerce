const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.route('/')
  .get(async (req, res) => {
    try {
      const allProducts = await Product.findAll({
        include: [{ model: Category }, { model: Tag, through: ProductTag }]
      });
      res.json(allProducts);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .post(async (req, res) => {
    try {
      const product = await Product.create(req.body);
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => ({
          product_id: product.id,
          tag_id,
        }));
        const productTags = await ProductTag.bulkCreate(productTagIdArr);
        return res.json(productTags);
      }
      res.json(product);
    } catch (err) {
      res.status(500).send(err);
    }
  });

router.route('/:id')
  .get(async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id, {
        include: [{ model: Category }, { model: Tag, through: ProductTag }]
      });
      if (!product) {
        return res.status(404).send('No product found with this id');
      }
      res.json(product);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .put(async (req, res) => {
    try {
      await Product.update(req.body, { where: { id: req.params.id } });
      const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds.filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => ({ product_id: req.params.id, tag_id }));
      const productTagsToRemove = productTags.filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);
      const updatedProductTags = await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
      res.json(updatedProductTags);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const rowsDeleted = await Product.destroy({ where: { id: req.params.id } });
      if (!rowsDeleted) {
        return res.status(404).send('No product found with this id');
      }
      res.send('Product deleted successfully');
    } catch (err) {
      res.status(500).send(err);
    }
  });


module.exports = router;
