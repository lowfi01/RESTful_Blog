const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blog_demo', { useNewUrlParser: true });

// Post - title, content
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model('Post', postSchema);

// User -  email, name
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  posts: [postSchema]
});

const User = mongoose.model('User', userSchema);

User.findOne({ name: 'Germie Herrero' }, (err, user) => {
  if (err) {
    console.log(err);
  }
  else {
    user.posts.push({
      title: 'How to muggle like a boss',
      content: 'buy short shirts'
    });
    user.save((error, savedUser) => {
      console.log(savedUser);
    });
  }
});

// const newUser = new User({
//   email: 'mahalherrero@gmail.com.au',
//   name: 'Germie Herrero'
// });

// newUser.posts.push({
//   title: 'How to bre polyjuice potion',
//   content: 'Just kidding, go to potions class to learn it'
// });

// newUser.save((err, user) => {
//   if (err) {
//     console.log('error saving user', err);
//   }
//   else {
//     console.log(user);
//   }
// });

// const newPost = new Post({
//   title: 'Reflections on Apples',
//   content: 'They are high fodmap and make me extremely sick'
// });

// newPost.save((err, post) => {
//   if (err) {
//     console.log('error saving post', err);
//   }
//   else {
//     console.log(post);
//   }
// });
