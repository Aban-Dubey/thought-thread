import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from '../styles/BlogHome.module.css';
import { likeBlog } from '../helper/blogHelper';



const BlogCard = ({ blog, onError }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(blog.likes); // Initialize likes state with the initial value from the blog

  const handleLike = async () => {
    const userId = localStorage.getItem('userId');
    try {
      await likeBlog(blog._id, userId);
      setIsLiked(true);
      setLikes((prevLikes) => ({ ...prevLikes, count: prevLikes.count + 1 }));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        onError('Already liked');
      }else{
        onError('Error liking blog');
      }
      
    }
  };
  
  const blogDate = new Date(blog.timestamp);
  const formattedDate = `${blogDate.toLocaleDateString()}`;
  const formattedTime = `${blogDate.toLocaleTimeString()}`;

  return (
    <div className={`${styles.blogCard} mt-4`}>
      <Link to={`/fullblog/${blog._id}`}>
        <h3 className={styles.blogTitle}>{blog.title}</h3>
      </Link>
      <p className={styles.blogAuthor}>Author: {blog.user?.username || 'Unknown Author'}</p>
      <p className="mt-2">
        Date: {formattedDate} | Time: {formattedTime}
      </p>
      <p className='mt-2'><span className='text-green-500'>Likes:</span> {likes.count}</p>
      <div className="flex mt-2">
      <button
        className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mr-4`}
        onClick={handleLike}
        disabled={isLiked}
      >
        {isLiked ? 'Liked' : 'Like'}
      </button>
      <Link to={`/fullblog/${blog._id}`} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 mr-4">
        See Comments
      </Link>
      <Link to={`/fullblog/${blog._id}`} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Full Blog
      </Link>
      </div>
    </div>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.object.isRequired,
};

export default BlogCard;

