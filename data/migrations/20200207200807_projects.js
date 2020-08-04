exports.up = function(knex) {
  return knex.schema
    .createTable('projects', tbl => {
      tbl.increments();
      // tbl.integer('tasks')
      //   .unsigned();
      tbl.text('name')
        // .unique() //not a requirement, but a good idea
        .notNullable();
      tbl.text('description');
      tbl.boolean('completed')
        .notNullable()
        .defaultTo(false);
      tbl.datetime('due');
      tbl.datetime('done');
    })
    .createTable('tasks', tbl => {
      tbl.increments();
      tbl.integer('project_id')
        .notNullable()
        .unsigned()
        .references('projects.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl.text('description')
        .notNullable();
      tbl.text('notes');
      tbl.boolean('completed')
        .notNullable()
        .defaultTo(false);
      tbl.datetime('due');
      tbl.datetime('done');
    })
    .createTable('resources', tbl => {
      tbl.increments();
      tbl.text('name')
        .notNullable();
      tbl.text('description');
    })
    .createTable('project_resources', tbl => {
      tbl.integer('project_id')
        .notNullable()
        .unsigned()
        .references('projects.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl.integer('resource_id')
        .notNullable()
        .unsigned()
        .references('resources.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl.primary(['project_id', 'resource_id']);
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('project_resources')
    .dropTableIfExists('resources')
    .dropTableIfExists('tasks')
    .dropTableIfExists('projects');
};
