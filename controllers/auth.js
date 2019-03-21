const User = require('../models/user');

module.exports = (app) => {

    // SIGN UP FORM
    app.get('/', (req, res) => {
        res.render('homepage');
    });

    app.get('/sign-up', (req, res) => {
        res.render('sign-up');
    });

    app.get('/login', (req, res) => {
        res.render('login');
    });

    app.get('/tenant', (req, res) => {
        res.render('tenant_dashboard');
    });

    app.get('/landlord', (req, res) => {
        res.render('landlord_dashboard');
    });

    
}
