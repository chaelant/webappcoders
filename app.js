const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const configRoutes = require('./routes');
const st = express.static(__dirname + '/public');

const app = express();

app.use('/public', st);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const handlebarsInstance = exphbs.create({
    defaultLayout: "main",
    // Specify helpers which are only registered on this instance.
    helpers: {
      asJSON: (obj, spacing) => {
        if (typeof spacing === "number")
          return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
  
        return new Handlebars.SafeString(JSON.stringify(obj));
      }
    },
    partialsDir: ["views/partials/"]
  });

app.engine("handlebars", handlebarsInstance.engine);
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});