/**
 * Import of packages
 */
// express is the base of this project
const express = require('express');
// essential for working with layout
const expressLayout = require('express-ejs-layouts');
// morgan for logs
const morgan = require('morgan');
// important for security
const helmet = require('helmet');
// for session saves and for remember the session of the clients
const session = require('express-session');
// for protection from CSRF ATTACKs
const csurf = require('csurf');

/**
 * Basic settings
 */

// include dotenv
require('dotenv').config();

// Path and fs for write/read ( logs )
const fs = require('fs');
const path = require('path');

// the base of express
const app = express();

// port
const port = process.env.PORT || 3000;

// set the public folder
app.use(express.static(path.join(__dirname, 'public')));

/**
 * View Engine Setup
 */

// Set EJS as the default view engine for express
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// use the ejs's layout system
app.use(expressLayout);
// set the default layout
app.set('layout', './layouts/layout');

/**
 * LOGS
 */
// LOGS for NODEMON
app.use(morgan('dev'));

// LOGS saved in accessLogStream.html
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'accessLogStream.html'),
  { flags : 'a'},
);
app.use(morgan('combined',{stream:accessLogStream}));


/**
 * Security
 **/

// Disable x-powered-by
app.disable('x-powered-by');
// Session Setup
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    sameSite: 'Strict', // or 'Lax' depending on your requirements
    secure: process.env.NODE_ENV === 'production', // set to true if using HTTPS
    httpOnly: true, // prevents client-side JavaScript from accessing the cookie
  },
}));
// Extra Layer for security ( Essential )
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], // Restricts sources of content to the app's own domain
      scriptSrc: ["'self'", "'unsafe-inline'"], // Adjust based on your script needs
      objectSrc: ["'none'"], // Prevents the loading of plugins like Flash
    },
  },
  hsts: true, // Enforces HTTPS and protects against downgrade attacks (only for HTTPS sites)
  frameguard: { action: 'deny' }, // Prevent your site from being put in a frame
  noSniff: true, // Prevent browsers from MIME-sniffing
  xssFilter: true, // Basic XSS protection for legacy browsers
}));
// CSRF protection
const csrfProtection = csurf();
app.use(csrfProtection);

// Middleware to check for custom headers
const customHeaderMiddleware = (req, res, next) => {
  if (req.method === 'POST' && !req.headers['x-requested-with']) {
    return res.status(403).send('Forbidden: Missing custom header');
  }
  next();
};
app.use(customHeaderMiddleware);


/**
 * Routers
 */

app.get('/',(req,res)=>{
  res.render('index');
});


/**
 * Handle the 2 cases :
 * If the current module is being run directly (i.e., not required by another module),
 * start the server on the specified port and log a message.
 * Otherwise, export the app module to be used in other files (e.g., for testing purposes).
 */

if (require.main === module) {
  app.listen(port, () => {
    console.log(`runned in ${port}`);
  });
} else {
  module.exports = app;
}
