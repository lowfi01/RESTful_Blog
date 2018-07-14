const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/objectReference_example', { useNewUrlParser: true });

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
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
});

const User = mongoose.model('User', userSchema);


// Find User
// Find all post for that user

User.findOne({ email: 'bob@gmail.com' }).populate('posts').exec((err, foundUser) => {
  if (err) {
    console.log(err);
  }
  else {
    console.log('user returned', foundUser);
  }
});

// Create a Post & store that as an Object reference within user
// Post.create({
//   title: 'How to cook great burgers Part 3',
//   content: 'Dont copy  mcdonalds'
// }, (err, post) => {
//   User.findOne({ email: 'bob@gmail.com' }, (findUserErr, foundUser) => {
//     if (err) {
//       console.log(findUserErr);
//     }
//     else {
//       foundUser.posts.push(post);
//       foundUser.save((savedUserErr, savedUser) => {
//         if (savedUserErr) {
//           console.log(savedUserErr);
//         }
//         else {
//           console.log(savedUser);
//         }
//       });
//     }
//   });
// });


// // Create a new user
// User.create({
//   email: 'bob@gmail.com',
//   name: 'Bob Belcher'
// }, (err, res) => {
//   console.log(res);
// });
