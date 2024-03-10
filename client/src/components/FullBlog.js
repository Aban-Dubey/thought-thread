import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import styles from '../styles/FullBlog.module.css';
import { fetchBlogById, addCommentToBlog } from '../helper/blogHelper';

const FullBlog = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const foundBlog = await fetchBlogById(blogId);
        setBlog(foundBlog);
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };

    fetchBlog();
  }, [blogId]);

  const toggleCommentForm = () => {
    setShowCommentForm(!showCommentForm);
  };

  const handleCommentSubmit = async () => {
    const userId = localStorage.getItem('userId');
    try {
      // Make a request to add the comment to the blog
      await addCommentToBlog(blogId, commentText, userId);

      // Fetch the updated blog data after adding the comment
      const updatedBlog = await fetchBlogById(blogId);
      setBlog(updatedBlog);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  
    // Toggle the form after submitting the comment
    toggleCommentForm();
  };

  if (!blog) {
    return <p>Loading...</p>;
  }

  const blogDate = new Date(blog.timestamp);
  const formattedDate = `${blogDate.toLocaleDateString()}`;
  const formattedTime = `${blogDate.toLocaleTimeString()}`;

  return (
    <section>
      <header>
        <Header />
      </header>
      <div className={`mx-auto ${styles.container}`}>
        <h1 className="text-2xl font-bold  mt-8 text-center">Complete Blog</h1>
        <div className="container mx-auto my-8 p-8 bg-white text-gray-800 rounded-lg shadow-md max-w-lg">
          <h2 className={`text-2xl font-bold mb-4 ${styles.blogTitle}`}>{blog.title}</h2>
          <p className={`mb-4 ${styles.blogDescription}`}>{blog.description}</p>
          <p className={`text-sm mb-2 ${styles.blogAuthor}`}>Author: {blog.user?.username || 'Unknown Author'}</p>
          <p className="text-sm mb-2">Date: {formattedDate} | Time: {formattedTime}</p>
          <p className="mb-2"><span className='text-green-500 font-semibold'>Likes:</span> {blog.likes.count}</p>
          <div className="mb-2">
            <span className='text-yellow-500 font-semibold'>Comments:</span>
            {blog.comments.map((comment, index) => (
              <div key={index} className="ml-4">
                <p className="font-semibold">{comment.user?.username || 'Unknown Author'}</p>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
          {showCommentForm ? (
            <div className="mb-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Enter your comment..."
                className="w-full p-2 border rounded-md text-gray-800"
              />
              <button
                onClick={handleCommentSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-2"
              >
                Add Comment
              </button>
            </div>
          ) : (
            <button
              onClick={toggleCommentForm}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Comment
            </button>
          )}
        </div>
      </div>

      <footer>
        <Footer />
      </footer>
    </section>
  );
};

export default FullBlog;
