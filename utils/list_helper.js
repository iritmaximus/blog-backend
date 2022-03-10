const _ = require("lodash");

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


  // saves the most liked post's likes to variable
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

const mostBlogs = (blogs) => {

  // count case with empty list out so
  // unneccesary code doesnt have to be run
  if (blogs.length === 0) {
    return "no blogs"; 
  }

  // array of author names
  const authors = blogs.map(blog => blog.author);
  let authorBlogs = [];


  // iterate through the author names and count the times 
  // names appear on it
  authors.map(author => {

    // find the index of author in authorBlogs, -1 if not
    const indexOfAuthorInList = _.findIndex(authorBlogs, a => a.author === author);

    // add author to list if not already in it
    if (indexOfAuthorInList === -1) {

      // format it like we want from the getgo
      const newAuthor = {
        "author": author,
        "blogs": 1
      };

      authorBlogs.push(newAuthor);

    }
    // if author is already in list, increment blogs
    else {
      authorBlogs[indexOfAuthorInList].blogs += 1;
    }
  });

  // then return the author with highest blog-count

  // sort the blogs and return the author with most blogs
  // aka first in the array
  const sortedBlogs = authorBlogs.sort((a, b) => b.blogs - a.blogs);
  return sortedBlogs[0];

};


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
