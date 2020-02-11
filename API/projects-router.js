const express = require('express');

const projects = require('./projects-model.js');
const resources = require ('./resources-model.js');

const router = express.Router();

router.get('/', (req, res) => {
  projects.getProjects()
    .then(projects => {
      res.json(projects);
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get projects' });
    });
});

router.get('/:projectId', (req, res) => {
  const { projectId } = req.params;

  projects.getProjectById(projectId)
    .then(project => {
      if (project) {
        // try {
        //   projects.getProjectTasks(projectId)
        //     .then(project_tasks => {
        //       // console.log(`project_tasks.length=${project_tasks.length}`);
        //       if (project_tasks) {
        //         tasks = new Array();
        //         project_tasks.forEach(t => {
        //           console.log(t);
        //           tasks.push(t);
        //         });
        //         project.tasks = tasks;
        //         // console.log(`tasks:\n${project.tasks}`);
        //       }
        //     });
        //   projects.getProjectResourceCount(projectId)
        //     .then(projectResourceCount => {
        //       const c = projectResourceCount[0].project_resource_count;
        //       // console.log(`projectResourceCount=${c}`);
        //       if (c > 0) {
        //         projects.getProjectResources(projectId)
        //           .then(project_resources => {
        //             // console.log(`project_resources.length=${project_resources.length}`);
        //             if (project_resources) {
        //               resources = new Array();
        //               project_resources.forEach(r => {
        //                 console.log(r);
        //                 resources.push(r);
        //               });
        //               project.resources = resources;
        //               // console.log(`resources:\n${project.resources}`);
        //             }
        //           });
        //       };
        //     });
        // } catch {
        //   //ignore errors
        // };
        // console.log(`project\n`, project);
        res.json(project);
      } else {
        res.status(404).json({ message: 'Could not get project with given projectId' });
      };
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get project' });
    });
});

router.get('/:projectId/tasks', (req, res) => {
  const { projectId } = req.params;
  console.log(`get/${projectId}/tasks`);

  projects.getProjectById(projectId)
    .then(project => {
      if (project) {
        projects.getProjectTasks(projectId)
          .then(projectTasks => {
            console.log(`tasks.length=${projectTasks.length}`);
            if (projectTasks.length) {
              res.json(projectTasks);
            } else {
              res.status(404).json({ message: 'Could not get tasks with given project' });
            }
          });
      } else {
        res.status(404).json({ message: 'Could not get project with given projectId' });
      }
    })
    .catch (err => {
      res.status(500).json({ message: 'Failed to get tasks' });
    });
});

router.get('/:projectId/tasks/:taskId', (req, res) => {
  const { projectId, taskId } = req.params;
  console.log(`get/${projectId}/tasks/${taskId}`);

  projects.getProjectById(projectId)
    .then(project => {
      if (project) {
        projects.getProjectTaskById(projectId, taskId)
          .then(projectTask => {
            if (projectTask) {
              res.json(projectTask);
            } else {
              res.status(404).json({ message: 'Could not get task with given projectId & taskId' });
            }
          });
      } else {
        res.status(404).json({ message: 'Could not get project with given projectId' })
      }
    })
    .catch (err => {
      res.status(500).json({ message: 'Failed to get task' });
    });
});

router.get('/:projectId/resources', (req, res) => {
  const { projectId } = req.params;
  console.log(`get/${projectId}/resources`);

  projects.getProjectById(projectId)
    .then(project => {
      if (project) {
        projects.getProjectResourceCount(projectId)
          .then(projectResourceCount => {
            const c = projectResourceCount[0].project_resource_count;
            console.log(`projectResourceCount=${c}`);
            if (c > 0) {
              projects.getProjectResources(projectId)
                .then(projectResources => {
                  res.json(projectResources);
                });
            } else {
              res.status(404).json({ message: 'Given project has no resources' });
            }
          });
      } else {
        res.status(404).json({ message: 'Could not get project with given projectId' });
      }
    })
    .catch (err => {
      res.status(500).json({ message: 'Failed to get resources' });
    });
});

router.get('/:projectId/resources/:resourceId', (req, res) => {
  const { projectId, resourceId } = req.params;
  console.log(`get/${projectId}/resources/${resourceId}`);

  projects.getProjectById(projectId)
    .then(project => {
      if (project) {
        projects.getProjectResourceById(projectId, resourceId)
          .then(projectResource => {
            if (projectResource) {
              res.json(projectResource);
            } else {
              res.status(404).json({ message: 'Could not get resource with given projectId & resourceId' });
            }
          });
      } else {
        res.status(404).json({ message: 'Could not get project with given projectId' })
      }
    })
    .catch (err => {
      res.status(500).json({ message: 'Failed to get resource' });
    });
});

router.post('/', (req, res) => {
  const projectData = req.body;

  if (!projectData.name) {
    res.status(400).json({ message: 'Required data missing' });
  } else {
    projects.addProject(projectData)
      .then(project => {
        res.status(201).json(project);
      })
      .catch (err => {
        res.status(500).json({ message: 'Failed to create new project' });
      });
  }
});

router.post('/:projectId/tasks', (req, res) => {
  const { projectId } = req.params;
  const taskData = req.body;

  if (!taskData.description) {
    res.status(400).json({ message: 'Required data missing' });
  } else {
    projects.getProjectById(projectId)
      .then(project => {
        if (project) {
          projects.addProjectTask(projectId, taskData)
          .then(projectTask => {
            res.status(201).json(projectTask);
          })
        } else {
          res.status(404).json({ message: 'Could not get project with given projectId' })
        }
      })
      .catch (err => {
        res.status(500).json({ message: 'Failed to create new task' });
      });
  }
});

router.post('/:projectId/resources/:resourceId', (req, res) => {
  const { projectId, resourceId } = req.params;

  projects.getProjectById(projectId)
    .then(project => {
      if (project) {
        resources.getResourceById(resourceId)
          .then(resource => {
            if (resource) {
              projects.addProjectResource(projectId, resourceId)
                .then(projectResource => {
                  res.status(201).json(projectResource);
                })
                .catch(err => {
                  res.status(500).json({ message: 'Failed to associate project resource' });
                });
            } else {
              res.status(404).json({ message: 'Could not get resource with given resourceId' });
            }
          })
          .catch(err => {
            res.status(500).json({ message: 'Failed to get resource' });
          });
      } else {
        res.status(404).json({ message: 'Could not get project with given projectId' });
      }
    })
    .catch (err => {
      res.status(500).json({ message: 'Failed to get project' });
    });
});

router.put('/:projectId', (req, res) => {
  const { projectId } = req.params;
  const changes = req.body;

  if (!changes.name) {
    res.status(400).json({ message: 'Required data missing' });
  } else {
    projects.getProjectById(projectId)
      .then(project => {
        if (project) {
          projects.updateProject(projectId, changes)
          .then(updatedProject => {
            res.json(updatedProject);
          });
        } else {
          res.status(404).json({ message: 'Could not get project with given projectId' });
        }
      })
      .catch (err => {
        res.status(500).json({ message: 'Failed to update project' });
      });
  }
});

router.put('/:projectId/tasks/:taskId', (req, res) => {
  const { projectId, taskId } = req.params;
  const changes = req.body;

  if (!changes.description) {
    res.status(400).json({ message: 'Required data missing' });
  } else {
    projects.getProjectById(projectId)
      .then(project => {
        if (project) {
          projects.getProjectTaskById(projectId, taskId)
            .then(task => {
              if (task) {
                projects.updateProjectTask(projectId, taskId, changes)
                  .then(updatedProjectTask => {
                    res.json(updatedProjectTask);
                  });
              } else {
                res.status(404).json({ message: 'Could not get task with given projectId & taskId' });
              }
            })
            .catch (err => {
              res.status(500).json({ message: 'Failed to update task' });
            });
        } else {
          res.status(404).json({ message: 'Could not get project with given projectId' });
        }
      })
      .catch (err => {
        res.status(500).json({ message: 'Failed to update project' });
      });
  }
});

router.delete('/:projectId', (req, res) => {
  const { projectId } = req.params;

  projects.removeProject(projectId)
    .then(deletedProject => {
      if (deletedProject) {
        res.json({ removedProject: parseInt(projectId, 10) });
      } else {
        res.status(404).json({ message: 'Could not get project with given projectId' });
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to delete project' });
    });
});

router.delete('/:projectId/tasks/:taskId', (req, res) => {
  const { projectId, taskId } = req.params;

  projects.removeProjectTask(projectId, taskId)
    .then(deletedProjectTask => {
      if (deletedProjectTask) {
        res.json({ removedProjectTask: parseInt(taskId, 10) });
      } else {
        res.status(404).json({ message: 'Could not get task with given projectId & taskId' });
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to delete task' });
    });
});

router.delete('/:projectId/resources/:resourceId', (req, res) => {
  const { projectId, resourceId } = req.params;

  projects.getProjectById(projectId)
    .then(project => {
      if (project) {
        projects.getProjectResourceById(projectId, resourceId)
          .then(resource => {
            if (resource) {
              projects.removeProjectResource(projectId, resourceId)
                .then(deletedProjectResource => {
                  if (deletedProjectResource) {
                    res.json({ removedProjectResource: parseInt(resourceId, 10) });
                  } else {
                    res.status(404).json({ message: 'Could not get resource with given projectId & resourceId' });
                  }
                })
                .catch(err => {
                  res.status(500).json({ message: 'Failed to remove resource from project' });
                });
            } else {
              res.status(404).json({ message: 'Could not get resource with given projectId & resourceId' });
            }
          })
          .catch (err => {
            res.status(500).json({ message: 'Failed to update resource' });
          });
      } else {
        res.status(404).json({ message: 'Could not get project with given projectId' });
      }
    })
    .catch (err => {
      res.status(500).json({ message: 'Failed to update project' });
    });
});

module.exports = router;