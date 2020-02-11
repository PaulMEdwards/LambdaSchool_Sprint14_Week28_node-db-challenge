const db = require('../data/dbConfig.js');

module.exports = {
  getProjects,
  getProjectById,
  getProjectTasks,
  getProjectTaskById,
  getProjectResourceCount,
  getProjectResources,
  getProjectResourceById,
  addProject,
  addProjectTask,
  addProjectResource,
  updateProject,
  updateProjectTask,
  removeProject,
  removeProjectTask,
  removeProjectResource
};

function getProjects() {
  return db("projects");
};

function getProjectById(project_id) {
  console.log(`getProjectById(${project_id})`);
  if (project_id) {
    return db("projects")
      .where("id", project_id)
      .first();
  } else {
    return null;
  }
};

function getProjectTasks(project_id) {
  console.log(`getProjectTasks(${project_id})`);
  if (project_id) {
    return db("projects as p")
      .leftJoin("tasks as t", "p.id", "t.project_id")
      .select("t.*", "p.name as project_name", "p.description as project_description")
      .where("p.id", project_id);
  } else {
    return null;
  }
};

function getProjectTaskById(project_id, task_id) {
  console.log(`getProjectTaskById(${project_id}, ${task_id})`);
  if (project_id && task_id) {
    return db("projects as p")
      .leftJoin("tasks as t", "p.id", "t.project_id")
      .select("t.*", "p.name as project_name", "p.description as project_description")
      .where("p.id", project_id)
      .andWhere("t.id", task_id)
      .first();
  } else {
    return null;
  }
};

function getProjectResourceCount(project_id) {
  console.log(`getProjectResourceCount(${project_id})`);
  if (project_id) {
    return db("project_resources as pr")
      .count("pr.resource_id as project_resource_count")
      .where("pr.project_id", project_id);
  } else {
    return null;
  }
};

function getProjectResources(project_id) {
  console.log(`getProjectResources(${project_id})`);
  if (project_id) {
    return db("projects as p")
      .leftJoin("project_resources as pr", "p.id", "pr.project_id")
      .leftJoin("resources as r", "pr.resource_id", "r.id")
      .select("r.*", "p.name as project_name", "p.description as project_description")
      .where("p.id", project_id);
  } else {
    return null;
  }
};

function getProjectResourceById(project_id, resource_id) {
  console.log(`getProjectResourceById(${project_id}, ${resource_id})`);
  if (project_id && resource_id) {
    return db("projects as p")
      .join("project_resources as pr", "p.id", "pr.project_id")
      .leftJoin("resources as r", "pr.resource_id", "r.id")
      .select("r.*", "p.name as project_name", "p.description as project_description")
      .where("p.id", project_id)
      .andWhere("r.id", resource_id)
      .first();
  } else {
    return null;
  }
};

function addProject(project) {
  return db("projects")
    .insert(project)
    .then(ids => this.getProjectById(ids[0]));
};

function addProjectTask(project_id, task) {
  if (project_id) {
    task.project_id = project_id;
    return db("tasks")
      .insert(task)
      .then(tasks => this.getProjectTaskById(project_id, tasks[0]));
  } else {
    return null;
  }
};

function addProjectResource(project_id, resource_id) {
  if (project_id && resource_id) {
    const pr = {
      project_id: project_id,
      resource_id: resource_id
    };
    console.log(`TCL: addProjectResource -> pr`, pr);
    return db("project_resources")
      .insert(pr)
      .then(resources => {
        console.log(`TCL: addProjectResource -> resources`, resources[0]);
        this.getProjectResourceById(project_id, resources[0]);
      })
      .catch(err => {
        console.log(`TCL: addProjectResource -> err`, err);
      });
  } else {
    return null;
  }
};

function updateProject(project_id, changes) {
  return db("projects")
    .where("id", project_id)
    .update(changes)
    .then(count => (count > 0 ? this.getProjectById(project_id) : null));
};

function updateProjectTask(projectId, task_id, changes) {
  return db("tasks")
    .where("id", task_id)
    .update(changes)
    .then(count => (count > 0 ? this.getProjectTaskById(projectId, task_id) : null));
};

function removeProject(project_id) {
  if (project_id) {
    return db("projects")
      .where("id", project_id)
      .del();
  } else {
    return null;
  }
};

function removeProjectTask(project_id, task_id) {
  if (project_id && task_id) {
    return db("tasks")
      .where("project_id", project_id)
      .andWhere("id", task_id)
      .del();
  } else {
    return null;
  }
};

function removeProjectResource(project_id, resource_id) {
  if (project_id && resource_id) {
    return db("project_resources")
      .where("project_id", project_id)
      .andWhere("resource_id", resource_id)
      .del();
  } else {
    return null;
  }
};
