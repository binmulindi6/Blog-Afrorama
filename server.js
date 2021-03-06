const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')

const methodOverride = require('method-override')
const app = express()
const path = require('path')

// connect to MongoDB
const dbURL = 'mongodb+srv://tommy:admin1201@cluster01.eaqkw.mongodb.net/Cluster01?retryWrites=true&w=majority';
mongoose.connect(dbURL, { useNewUrlParser : true, useUnifiedTopology: true})
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// default options
app.use( express.static( path.join(__dirname, "public")));

//routes
const articleRouter = require('./routes/articles')
const contactRouter = require('./routes/contact')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use('/articles', articleRouter)
app.use(contactRouter)

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('index', { articles: articles })
})


// default options
app.use( express.static( path.join(__dirname, "public")));

