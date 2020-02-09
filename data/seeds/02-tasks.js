exports.seed = function(knex) {
  // return knex('tasks').truncate()
  //   .then(function () {
      return knex('tasks').insert([
        {
          project_id: 1,
          description: 'Test Task 1',
          notes: 'Test Task 1 Notes'
        },
        {
          project_id: 1,
          description: 'Test Task 2',
          notes: 'Test Task 2 Notes'
        },
        {
          project_id: 1,
          description: 'Test Task 3',
          notes: 'Test Task 3 Notes'
        }
      ]);
  // });
};
