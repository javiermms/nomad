const express = require('express')
const app = express();

var exphbs = require('express-handlebars')

app.use(express.static('public'))

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

require('./data/nomad-db');
require('./controllers/auth.js')(app);


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
