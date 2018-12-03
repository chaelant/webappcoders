const dbRoutes = require('./db');

const constructorMethod = app => {
    app.use('/db', dbRoutes);

    app.use('/', (req, res) => {
        res.send({ navigateTo: '/db' });
    });
};

module.exports = constructorMethod;