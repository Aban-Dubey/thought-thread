import Blog from "../model/blogModel.js";
import User from "../model/userModel.js";

export const getAllBlogs = async (req, res, next) => {
    try {
      const blogs = await Blog.find().populate('user', 'username');
      if (!blogs || blogs.length === 0) {
        return res.status(404).json({ message: "No blogs found!" });
      }
      return res.status(200).json({ blogs });
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  export const addBlog = async (req, res, next) => {
    const { title, description, user } = req.body;

    try {
        // Find the user by ID
        const existingUser = await User.findById(user);

        // Check if the user exists
        if (!existingUser) {
            return res.status(400).json({ message: "Cannot find the user with this id!" });
        }

        // Create a new blog with user association
        const blog = new Blog({
            title,
            description,
            user,
        });

        // Save the blog
        const savedBlog = await blog.save();

        // Update the user's blogs array
        existingUser.blogs.push(savedBlog._id);
        await existingUser.save();

        // Respond with the saved blog information
        res.status(200).json({ blog: savedBlog });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateBlog = async(req,res,next)=>{
    console.log(req.params);
    console.log(req.body);
    const blogId =  req.params.id;
    const title = req.body.title;
    console.log(req.params);
    console.log(req.body);
    const description = req.body.description;
    let updatedBlog;
    try {
        updatedBlog = await Blog.findByIdAndUpdate(blogId, {
        title: title,
        description: description
    });
    } catch (error) {
        console.log(error);
        return error;
    }
    
    if(!updatedBlog){
      return res.status(500).json({message: "Cannot update the blog!"});
    }
    return res.status(200).json({message: "Blog updated successfully!"});
};

export const getBlogById = async(req,res,next)=>{
    const blogId = req.params.id;
    let foundBlog;
    try {
        foundBlog = await Blog.findById(blogId).populate('user', 'username');
    } catch (error) {
        console.log(error);
        return error;
    }
    if(!foundBlog){
        return res.status(404).json({message: "Intended blog cannot be found!"});
    }
    return res.status(200).json({foundBlog});
};

export const deleteBlogById = async(req,res,next)=>{
    console.log(req.params);
    const blogId = req.params.id;
    let deletedBlog;
    try {
        deletedBlog = await Blog.findByIdAndDelete(blogId).populate("user"); //by using populate deletedBlog will now have the access to the object of the "user". And now deletedBlog can be used to access the blogs field and pull the deleted blog from the array of blogs for a user.
        await deletedBlog.user.blogs.pull(deletedBlog); //using deletedBlog to pull the deleted blog from the array of blogs
        await deletedBlog.user.save(); // using deletedBlog to save the user details to the database
    } catch (error) {
        console.log(error);
        return error;
    }
    if(!deletedBlog){
        return res.status(500).json({message: "Cannot delete the intended blog"});
    }
    return res.status(200).json({message: "Blog deleted successfully!"});
};

export const getUserBlogs = async (req,res,next)=>{
    const userId = req.params.id;
    let userBlogs;
    try {
        userBlogs = await User.findById(userId).populate("blogs");
    } catch (error) {
        console.log(error);
        return error;
    }
    if(!userBlogs){
        return res.status(404).json({message: "No blogs found!"});
    }
    return res.status(200).json({userBlogs});
};

export const addComment = async (req, res, next) => {
    const { blogId } = req.params;
    const { userId, text } = req.body;
    try {
      // Find the blog by ID
      const existingBlog = await Blog.findById(blogId);
  
      // Check if the blog exists
      if (!existingBlog) {
        return res.status(404).json({ message: "Blog not found!" });
      }
  
      // Find the user by ID
      const existingUser = await User.findById(userId);
  
      // Check if the user exists
      if (!existingUser) {
        return res.status(400).json({ message: "Cannot find the user with this id!" });
      }
  
      // Create a new comment
      const comment = {
        user: {
            userId: existingUser._id,
            username: existingUser.username,
        },
        text,
      };
  
      // Add the comment to the blog
      existingBlog.comments.push(comment);
  
      // Save the updated blog
      const updatedBlog = await existingBlog.save();
  
      // Respond with the updated blog information
      res.status(200).json({ blog: updatedBlog });
    } catch (error) {
      console.error('Error adding comment:', error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const likeBlog = async (req, res, next) => {
  const { blogId } = req.params;
  const { userId } = req.body;

  try {
      // Find the blog by ID
      const existingBlog = await Blog.findById(blogId);

      // Check if the blog exists
      if (!existingBlog) {
          return res.status(404).json({ message: "Blog not found!" });
      }

      // Ensure that the likes object is initialized
      existingBlog.likes = existingBlog.likes || { count: 0, likedBy: [] };

      // Check if the user has already liked the blog
      if (existingBlog.likes.likedBy.includes(userId)) {
          return res.status(400).json({ message: "User already liked this blog!" });
      }

      // Increment the like count
      existingBlog.likes.count += 1;

      // Add the userId to the likedBy array
      existingBlog.likes.likedBy.push(userId);

      // Save the updated blog
      const updatedBlog = await existingBlog.save();

      // Respond with the updated blog information
      return res.status(200).json({ blog: updatedBlog });
  } catch (error) {
      console.error('Error liking blog:', error);
      return res.status(500).json({ message: "Internal Server Error" });
  }
};

  