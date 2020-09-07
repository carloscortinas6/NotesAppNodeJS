const express = require('express');
const path = require('path');
const app = express();
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


require('./database');
require('./config/passport');

//settings-configuraciones
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir:  path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view-engine', '.hbs');

//midlewares - funciones ejecutadas antes de llegar al servidor
app.use(express.urlencoded({extended:false})) //no quiero imagenes al recoger datos
app.use(methodOverride('_method')); //para que los formularios puedan enviar put, delete...
app.use(session({
    secret:'mysecretapp',
    resave: true,
    saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//global variables
app.use((req, res, next) => {
    res.locals.succes_msg = req.flash('succes_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//static files
app.use(express.static(path.join(__dirname,'public')));

//server inicilization
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
});