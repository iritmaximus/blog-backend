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
  const theBlog = blogs.find((blog) => mostLikes === blog.likes);

  return {
    title: theBlog.title,
    author: theBlog.author,
    likes: theBlog.likes,
  };
};

const mostBlogs = (blogs) => {
  // count case with empty list out so
  // unneccesary code doesnt have to be run
  if (blogs.length === 0) {
    return "no blogs";
  }

  // array of author names
  const authors = blogs.map((blog) => blog.author);
  let authorBlogs = [];

  // iterate through the author names and count the times
  // names appear on it
  authors.map((author) => {
    // find the index of author in authorBlogs, -1 if not
    const indexOfAuthorInList = _.findIndex(
      authorBlogs,
      (a) => a.author === author,
    );

    // add author to list if not already in it
    if (indexOfAuthorInList === -1) {
      // format it like we want from the getgo
      const newAuthor = {
        author: author,
        blogs: 1,
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

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

const blog = {
  _id: "5a422b3a1b54a676234d17f9",
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
  likes: 12,
  __v: 0,
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  blogs,
};
