const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');

const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError')
//required for the put request  =>faking our express to treat it as a put request (it was POST)
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const { getMaxListeners } = require('process');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    //useCreateIndex= true
    //useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
    console.log("Database connected");
});
const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));



app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 70, //milisec
        maxAge: 1000 * 60 * 60 * 24 * 70

    }

}
app.use(session(sessionConfig))

app.use(flash());
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'jfgffffv@getMaxListeners.com', username: 'ferenczik' })
    const newUser = await User.register(user, 'chicken')
    res.send(newUser);

})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.get('/', (req, res) => {
    // res.send('Hello from YELPCAMP')
    res.render('home')
});

app.all('*', (req, res, next) => {
    //res.send('UPSSS 404')
    next(new ExpressError('Page not found', 404))
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'OHHH noo!Something went wrong!'
    res.status(statusCode).render('error', { err })
})
app.listen(3000, () => {
    console.log("Serving on port 3000")
})
