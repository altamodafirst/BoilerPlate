const db = require('./server/db');
const User = require('./server/db/models/user')
// require models here

//find way to get data, maybe in array and Promise all with create?

async function seed() {
const credentials = [
  { username: 'lucy', password: 'lucy_pw' },
  { username: 'moe', password: 'moe_pw' },
  { username: 'larry', password: 'larry_pw'}
];

  await Promise.all(credentials.map(credential => User.create(credential)));
}
const main = () => {
    console.log('Syncing db...');
    db.sync({ force: true })
      .then(() => {
        console.log('Seeding databse...');
        return seed();
      })
      .catch(err => {
        console.log('Error while seeding');
        console.log(err.stack);
      })
      .then(() => {
        db.close();
        return null;
      });
  };
  
  main();