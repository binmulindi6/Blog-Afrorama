const express = require('express')
const Article = require('./../models/article')
const router = express.Router()
const fs = require('fs');
const fileUpload = require('express-fileupload');
const node_path = require('path')



// default options
router.use(fileUpload());
router.use( express.static( node_path.join(__dirname, "public")));


router.get('/new', (req, res) => {
  res.render('new', { article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('edit', { article: article })
})

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/')
  res.render('show', { article: article })
})

router.post('/', async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})


function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    //adds-on
    let newImageName
    let image = req.files.image
    const imageName = new Date().getTime()

    //get file extention
    let ex = node_path.extname(image.name)
    console.log(ex)
    
    //new file name
    newImageName = imageName + ex;

    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    //adds-on 
    article.image = newImageName
    
    //save the image to server
    saveImage(image,newImageName)
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
    res.redirect('/articles/new')
  }
}

function saveImage(image,newImageName) {
  uploadPath = './public/uploads/' + newImageName.toString();
    
  //mv() method to place the file somewhere on the server
  image.mv(uploadPath, (err) => {
    if (err)
      return res.status(500).send(err);
      console.log('imageSaved')
  });
}

module.exports = router