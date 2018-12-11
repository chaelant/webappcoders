const dbRoutes = require('./db');
const reviewRoutes = require('./reviews');
const userRoutes = require('./users');
//const detailRoutes = require('./detail');

const constructorMethod = app => {
    app.use('/', dbRoutes);
    app.use('/reviews', reviewRoutes);
    app.use('/users', userRoutes);
    // app.use('/detail', detailRoutes);


    app.use('*', (req, res) => {
        res.status(404).send('Bad Request');
        // res.redirect('/');
    });
};

module.exports = constructorMethod;