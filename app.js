const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');

const app = express();

app.set('view engine', 'ejs');


app.use(methodOverride('_method')); // use method-override & search for ?_method in action in form
app.use(express.static('public')); // make root directory
app.use(bodyParser.urlencoded({ extended: true })); // convert CRUD data into readable format
app.use(expressSanitizer()); // gain access on the resquest body object to sanitize method


mongoose.connect('mongodb://localhost:27017/restfulblog_app', { useNewUrlParser: true });

// create schema & model
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema);

// Show homepage
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log('error', err);
    }
    else {
      res.render('index', { blogs });
    }
  });
});


// Create NEW Blog Post page
app.get('/blogs/new', (req, res) => {
  res.render('new');
});

// Route that creates NEW Blog Post
app.post('/blogs', (req, res) => {
  // sanitize body
  const body = req.sanitize(req.body.blogs.body);
  const { title, image } = req.body.blogs;

  // note - we can pass req.body.blogs as data
  Blog.create({ title, image, body }, (err, blog) => {
    if (err) {
      console.log('error with creating new blog post');
      res.render('new');
    }
    else {
      res.redirect('/blogs');
    }
  });
});

// SHOW individual blog post
app.get('/blogs/:id', (req, res) => {
  const { id } = req.params;
  Blog.findById({ _id: id }, (err, foundBlog) => {
    if (err) {
      res.redirect('/blogs');
    }
    res.render('show', { blog: foundBlog });
  });
});


// EDIT individual blog post
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('/blogs');
    }
    else {
      res.render('edit', { blog: foundBlog });
    }
  });
});


// Update Route
app.put('/blogs/:id', (req, res) => {
  req.body.blogs.body = req.sanitize(req.body.blogs.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blogs, (err, updatedBlog) => {
    if (err) {
      res.redirect('/blogs');
    }
    else {
      res.redirect(`/blogs/${updatedBlog._id}`); // eslint-disable-line
    }
  });
});

// Route Delete a blog post
app.delete('/blogs/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err, deletedBlog) => {
    if (err) {
      res.redirect('/blogs');
    }
    else {
      res.redirect('/blogs');
    }
  });
});


// Default route
app.get('*', (req, res) => {
  res.redirect('/blogs');
});

app.listen(3000, () => {
  console.log('Server is live on 3000');
});
