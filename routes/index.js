const dbRoutes = require('./db');
const reviewRoutes = require('./reviews');
const userRoutes = require('./signuplogin');

const constructorMethod = app => {
    app.use('/', dbRoutes);
    app.use('/reviews', reviewRoutes);
    app.use('/users', userRoutes);


    app.use('*', (req, res) => {
        res.redirect('/');
    });
};

module.exports = constructorMethod;