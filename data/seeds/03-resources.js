exports.seed = function(knex) {
  // return knex('resources').truncate()
  //   .then(function () {
      return knex('resources').insert([
        {
          name: 'Test Resource 1',
          description: 'Test Resource 1 Description'
        },
        {
          name: 'Test Resource 2',
          description: 'Test Resource 2 Description'
        }
      ]);
  // });
};
