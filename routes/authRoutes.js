const passport = require('passport');
const {isAuth} = require('../services/middleware');
const User = require('../models/User');
const Item = require('../models/Item');
const bodyParser = require('body-parser');
const { redirect } = require('express/lib/response');
const { db } = require('../models/User');
const { Db } = require('mongodb');



module.exports = app => {

    let listaNova = '';

    app.use(bodyParser.urlencoded({ extended: true }))

    app.get('/', (req, res) => {
        let date = new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'full',
            timeStyle: 'long'
        }).format(new Date());
        res.render('index', {
            date_tag: date,
            message_tag: 'Access your Google Account',
        });
    });

    app.get('/home'), (req, res) => {
        res.redirect('/');
    }

    app.get('/success', (req, res) => {
        console.log("User Authenticated:", req.isAuthenticated());
        console.log('Session expires in:', req.session.cookie.maxAge / 1000);
        res.render('success', {
            message: 'Authorization Successful!',
            user: req.user,
        });
    });

    app.get('/status', (req, res) => {
        res.render('status', {
            status: req
        });
    });

    app.get('/error', (req, res) => {
        res.render('error', {
            message_tag: 'Authentication Error'
        });
    });

    app.get('/resource', (req, res, next) => {
        res.render('resource', {
            authenticated: req.isAuthenticated()
        });
    });


    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/status');
        console.log("User Authenticated:", req.isAuthenticated());

    });

    app.get('/login', passport.authenticate('google', {
        scope: ['profile', 'email'],
        accessType: 'offline', // Requests a refresh token
        prompt: 'consent'
    })
    );

    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/error'
    }),
        (req, res) => {
            // Successful authentication, redirect to saved route or success.
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            res.redirect(returnTo || '/success');
        });
    
   

    app.get('/create', (req, res) => {
        res.render('create', {
            user: req.user
        });
    });

    app.get('/display', async (req, res) => { 

        
        try {
            const lista = await Item.find({ googleId: req.user.googleId });

            res.render('display', {
                user: req.user,
                listItems: lista
            });

        } catch (err) {
            //console.error(err);
            res.render('error', {
                message_tag: ''
            });
        }
   
    });

    app.post('/display', async (req, res) => {
        const myItem = new Item({
            title: req.body.title,
            authors: req.body.authors,
            abstract: req.body.abstract,
            googleId: req.user.googleId,
        });
         
        try {
            const thisItem = await myItem.save();
            console.log('Created item: ', thisItem);
            res.redirect('/display');
        } catch (err) {
            console.error(err);
            res.render('error', {
                message_tag: ' Could not create item'
            });
        }
  
    });

    app.post('/eliminate/:id', async (req, res) => { 

        try {
            console.log(req.params.id);
            const result = await Item.deleteOne({_id : req.params.id})
            //console.log(result);
            
            res.redirect('/display');

        } catch (err) {
            console.error(err);
            res.render('error', {
                message_tag: ''
            });
        }
    });    
};
