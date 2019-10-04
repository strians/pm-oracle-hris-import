const APP = 'pmoracle';
const Application = require('./src/application.js');

let app = new Application(APP);

app.run().then(() => {
  console.log('Done');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
