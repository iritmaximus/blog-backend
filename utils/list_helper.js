const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {

  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0);

};

// not the cleanest implementation (at all... but it works)
const favoriteBlog = (blogs) => {

  // if no blogs, end
  if (blogs.length === 0) {
    return "no blogs";
  }
  // now we know there are blogs


  // saves the most liked post's likes
  const mostLikes = blogs.reduce((highestLikes, blog) => {
    // if blogs likes are more than previous, -> new highest likes
    if (highestLikes < blog.likes) {
      highestLikes = blog.likes;
    }
    return highestLikes;
  }, 0);

  // find the blog with most likes
  const theBlog = blogs.find(blog => mostLikes === blog.likes);

  return {
    title: theBlog.title,
    author: theBlog.author,
    likes: theBlog.likes
  };
};


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,

};
