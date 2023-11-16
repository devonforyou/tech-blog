// Purpose: Export all models
const Post = require("./Post");
const User = require('./User');
const Comment = require('./Comment');

// create associations
// Post belongsTo User, and User hasMany Post
Post.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

User.hasMany(Post, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

// Comments belongsTo Post, and Post hasMany Comments
// Not actually associating the Comment model with the Post model yet
Comment.belongsTo(Post, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE',
});

Post.hasMany(Comment, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE',
});


// Comment belongsTo User, and User hasMany Comments
Comment.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});


module.exports = {
  User,
  Post,
  Comment,
};