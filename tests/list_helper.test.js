const request = require("supertest");
const app = require("../app");

const listHelper = require("../utils/list_helper");



test("dummy returns one", () => {
  const result = listHelper.dummy(listHelper.blogs);
  expect(result).toBe(1);
});


describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    }
  ];

  test("when list has only one blog equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test("of bigger list is calculated right", () => {
    const result = listHelper.totalLikes(listHelper.blogs);
    expect(result).toBe(36);
  });
});


describe("favoriteBlog", () => {
  let blog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    likes: 12
  };

  test("of empty list", () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBe("no blogs");
  });

  test("of one blog", () => {
    const result = listHelper.favoriteBlog([blog]);
    expect(result).toEqual(blog);
  });

  test("of list of blogs", () => {
    const result = listHelper.favoriteBlog(listHelper.blogs);
    expect(result).toEqual(blog);
  });
});


describe("most blogs", () => {

  // one blog
  let blog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    likes: 12
  };

  // comparison for single blog
  const comparisonSingleBlog = {
    author: "Edsger W. Dijkstra",
    blogs: 1
  };

  // comparison
  const comparisonBlog = {
    author: "Robert C. Martin",
    blogs: 3
  };

  test("of no blogs", () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toBe("no blogs");
  });

  test("of one blog", () => {
    const result = listHelper.mostBlogs([blog]);
    expect(result).toEqual(comparisonSingleBlog);
  });

  test("of list of blogs", () => {
    const result = listHelper.mostBlogs(listHelper.blogs);
    expect(result).toEqual(comparisonBlog);
  });
});

describe("part 4b", () => {
  it("GET", async () => {
    const result = await request(app).get("/api/blogs");
    expect(result).toHaveLength(1);
  });
  it.todo("unique identifier is id");
  it.todo("POST works");
  it.todo("no likes defaults to 0");
  it.todo("if url and title is missing => error");
});
