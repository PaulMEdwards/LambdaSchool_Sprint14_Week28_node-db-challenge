const express = require('express');

const resources = require('./resources-model.js');

const router = express.Router();

router.get('/', (req, res) => {
  resources.getResources()
    .then(resources => {
      res.json(resources);
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get resources' });
    });
});

router.get('/:resourceId', (req, res) => {
  const { resourceId } = req.params;

  resources.getResourceById(resourceId)
    .then(resource => {
      if (resource) {
        res.json(resource);
      } else {
        res.status(404).json({ message: 'Could not get resource with given resourceId' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get resources' });
    });
});

router.post('/', (req, res) => {
  const resourceData = req.body;

  if (!resourceData.name) {
    res.status(400).json({ message: 'Required data missing' });
  } else {
    resources.addResource(resourceData)
      .then(addedResource => {
        res.status(201).json(addedResource);
      })
      .catch (err => {
        res.status(500).json({ message: 'Failed to create new resource' });
      });
  }
});

router.put('/:resourceId', (req, res) => {
  const { resourceId } = req.params;
  const changes = req.body;

  if (!changes.name) {
    res.status(400).json({ message: 'Required data missing' });
  } else {
    resources.getResourceById(resourceId)
      .then(resource => {
        if (resource) {
          resources.updateResource(resourceId, changes)
          .then(updatedResource => {
            res.json(updatedResource);
          });
        } else {
          res.status(404).json({ message: 'Could not get resource with given resourceId' });
        }
      })
      .catch (err => {
        res.status(500).json({ message: 'Failed to update resource' });
      });
  }
});

router.delete('/:resourceId', (req, res) => {
  const { resourceId } = req.params;

  resources.removeResource(resourceId)
    .then(deleted => {
      if (deleted) {
        res.json({ removedResource: parseInt(resourceId, 10) });
      } else {
        res.status(404).json({ message: 'Could not get resource with given resourceId' });
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to delete resource' });
    });
});

module.exports = router;