exports.seed = function(knex) {
  // return knex('projects').truncate()
  //   .then(function () {
      return knex('projects').insert([
        {
          name: 'Test Project',
          description: 'Test Project Description'
        }
      ]);
  // });
};
