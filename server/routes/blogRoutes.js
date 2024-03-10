import express from "express";
import {getAllBlogs, addBlog, updateBlog, getBlogById, deleteBlogById, getUserBlogs, addComment, likeBlog} from "../controllers/blogControllers.js"

const blogRouter = express.Router();

blogRouter.get("/",getAllBlogs);
blogRouter.post("/add",addBlog);
blogRouter.put("/update/:id",updateBlog);
blogRouter.get("/getById/:id",getBlogById);
blogRouter.delete("/delete/:id",deleteBlogById);
blogRouter.get("/userBlogs/:id",getUserBlogs) //here :id represent the id of the user and not of the blog because we want all the blogs for a user(identified by its id)
blogRouter.post("/comments/:blogId", addComment);
blogRouter.post("/like/:blogId", likeBlog);

export default blogRouter;