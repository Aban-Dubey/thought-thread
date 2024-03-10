import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/MyBlogs.module.css';
import PropTypes from 'prop-types';
import { deleteBlog } from '../helper/blogHelper';

function MyBlogCard({ blog, onUpdate }) {
  const blogId = blog._id;
  const navigate = useNavigate();

  const handleDelete = async (blogId) => {
    try {
      await deleteBlog(blogId);
      onUpdate();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };
  const handleBlogUpdate = (blogId) => {
    // Navigate to the updateblog route with the specific blogId
    navigate(`/updateblog/${blogId}`);
  };

  const formattedDate = new Date(blog.timestamp).toLocaleDateString();
  const formattedTime = new Date(blog.timestamp).toLocaleTimeString();

  return (
    <div className={`${styles.blogCard} mt-4 mr-4`}>
      <Link to={`/fullblog/${blogId}`}>
        <h3 className={styles.blogTitle}>{blog.title}</h3>
      </Link>
      <p className={styles.blogDescription}>{blog.description}</p>
      <p className='mt-2'>
        Date: {formattedDate} | Time: {formattedTime}
      </p>
      <p className='mt-2'><span className='text-green-500'>Likes:</span> {blog.likes.count}</p>
      <div className="flex mt-2">
        <button onClick={() => handleBlogUpdate(blogId)} className="text-blue-500 mr-4">
          Update
        </button>
        <button onClick={() => handleDelete(blogId)} className="text-red-500">
          Delete
        </button>
      </div>
    </div>
  );
}

MyBlogCard.propTypes = {
  blog: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default MyBlogCard;

