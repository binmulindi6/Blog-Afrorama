const express = require("express");
const mongoose = require('mongoose')
const  router = express.Router();
const fs = require('fs');
const path = require('path');
const Article = require('./models/article')
const { title } = require('process');
let datas = []
  
/* GET home page. */
router.get('/home', (req, res, next) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('index', { articles: articles,title:"Home" })
  })


router.get('/', (req, res, next) => {
    res.redirect('/home')
})

module.exports = router;