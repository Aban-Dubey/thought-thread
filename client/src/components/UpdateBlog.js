import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/UpdateBlog.module.css';
import Header from './Header';
import Footer from './Footer';
import { updateBlog, fetchBlogById } from '../helper/blogHelper';

const UpdateBlog = () => {
    const { blogId } = useParams();
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      // Fetch the existing blog data using the blogId
      const fetchBlog = async () => {
        try {
          const existingBlog = await fetchBlogById(blogId); // Use fetchBlogById to get the existing blog data
          setNewTitle(existingBlog.title);
          setNewDescription(existingBlog.description);
        } catch (error) {
          console.error('Error fetching blog:', error);
        }
      };
  
      fetchBlog();
    }, [blogId]);

    const handleUpdate = async () => {
      try {
        // Make a PUT request to update the blog
        await updateBlog(blogId, {
          title: newTitle,
          description: newDescription,
        });
  
        // After successful update, navigate to the blog details page
        navigate(`/myblogs`);
      } catch (error) {
        console.error('Error updating blog:', error);
      }
    };
  

  return (
    <section>
    <header>
        <Header />
    </header>
        <div className={styles.updateBlogContainer}>
        <div className={`container mx-auto my-8 p-8 bg-white text-gray-800 rounded-lg shadow-md max-w-lg`}>
        <h2 className="text-2xl font-bold mb-4">Update Blog</h2>
        <div>
        <label className="block text-sm font-semibold mb-2">Title:</label>
        <input
                className={styles.inputField}
                type="text"
                placeholder="New Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
            />
        </div>
        <div>
        <label className="block text-sm font-semibold mb-2">Description:</label>
        <textarea
                className={styles.textareaField}
                value={newDescription}
                placeholder="New Description"
                onChange={(e) => setNewDescription(e.target.value)}
            />
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={handleUpdate}>
            Update
        </button>
        </div>
        </div>
        <footer>
            <Footer />
        </footer>
    </section>
  );
};

export default UpdateBlog;
