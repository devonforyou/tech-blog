const sequelize = require("../config/connection");
const { User, Post, Comment } = require("../models");

const userSeedData = require("./userSeedData.json");
const postSeedData = require("./postSeedData.json");
const commentSeedData = require("./commentSeedData.json");

const seedDb = async () => {
  await sequelize.sync({ force: true });
  console.log("\n----- Database synced -----\n");

  // Seed Users
  const users = await User.bulkCreate(userSeedData, {
    individualHooks: true,
    returning: true,
  });
  console.log("'\n ----- Users seeded -----\n");

  // Seed Posts
  for (const postData of postSeedData) {
    const post = await Post.create({
      ...postData,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      returning: true,
    });

    // add a random number of comments to each post using the commentSeedData
    // post_id will be the UUID of the post we just created
    for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
      await Comment.create({
        ...commentSeedData[i],
        user_id: users[Math.floor(Math.random() * users.length)].id,
        post_id: post.id,
      });
    }

  }
  console.log("'\n ----- Posts seeded -----\n");

  process.exit(0);
};

seedDb();