exports.seed = function(knex) {
  // return knex('projects').truncate()
  //   .then(function () {
      return knex('projects').insert([
        {
          name: 'Default Project',
          description: 'Default Project Description'
        }
      ]);
  // });
};
