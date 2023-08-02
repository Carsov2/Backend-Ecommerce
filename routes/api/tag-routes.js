const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.route('/')
  .get(async (req, res) => {
    try {
      const allTags =  await Tag.findAll({
        include: [{model: Product, through: ProductTag}]
      });
      res.json(allTags);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .post(async (req, res) => {
    try {
      const newTag = await Tag.create(req.body);
      res.status(201).json(newTag);
    } catch(err) {
      res.status(500).send(err);
    }
  });

router.route('/:id')
  .get(async (req, res) => {
    try {
      const singleTag = await Tag.findByPk(req.params.id, {
        include: [{model: Product, through: ProductTag}]
      });

      if (!singleTag) {
        return res.status(404).send('No tag with that ID exists.');
      }
      
      res.json(singleTag);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .put(async (req, res) => {
    try {
      const [numAffectedRows] = await Tag.update(req.body, {
        where: {
          id: req.params.id
        }
      });

      if (numAffectedRows === 0) {
        return res.status(404).send('No tag with that ID exists.');
      }

      res.send('Tag updated successfully!');
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const numAffectedRows = await Tag.destroy({
        where: {
          id: req.params.id
        }
      });

      if (numAffectedRows === 0) {
        return res.status(404).send('No tag with that ID exists.');
      }

      res.send('Tag deleted successfully!');
    } catch (err) {
      res.status(500).send(err);
    }
  });


module.exports = router;
