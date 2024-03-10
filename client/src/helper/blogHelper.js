import axios from 'axios';

//BlogHome
axios.defaults.baseURL = "http://localhost:8080";

export async function fetchBlogs() {
  try {
    const response = await axios.get('/api/blogs/');
    return response.data.blogs;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
}

//BlogCard
export const likeBlog = async (blogId, userId) => {
    try {
      const response = await axios.post(`/api/blogs/like/${blogId}`, { userId });
      return response.data;
    } catch (error) {
      console.error('Error liking blog:', error);
      throw error;
    }
  };

//FullBlog
export async function fetchBlogById(blogId) {
    try {
      const response = await axios.get(`/api/blogs/getById/${blogId}`);
      return response.data.foundBlog;
    } catch (error) {
      console.error('Error fetching blog by ID:', error);
      throw error;
    }
  }
  
  export async function addCommentToBlog(blogId, text, userId) {
    try {
      const response = await axios.post(`/api/blogs/comments/${blogId}`, { text, userId });
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  //MyBlogs
  export async function fetchUserBlogs(userId) {
    try {
      const response = await axios.get(`/api/blogs/userBlogs/${userId}`);
      return response.data.userBlogs.blogs;
    } catch (error) {
      throw error;
    }
  }
  
  export async function deleteBlog(blogId) {
    try {
      const response = await axios.delete(`/api/blogs/delete/${blogId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  //UpdateBlog
  export async function updateBlog(blogId, updatedData) {
    try {
      const response = await axios.put(`/api/blogs/update/${blogId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating blog: ${error.message}`);
      throw error;
    }
  }

  //AddBlog
  export async function addNewBlog(title, description, userId) {
    try {
      const response = await axios.post('/api/blogs/add', {
        title,
        description,
        user: userId,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding blog:', error);
      throw error;
    }
  };