import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Header from './Header';
import Footer from './Footer';
import styles from '../styles/AddBlog.module.css';
import { addNewBlog } from '../helper/blogHelper';

function AddBlog() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem('userId');

      // Use the addNewBlog function to add the blog
      await addNewBlog(title, description, userId);

      toast.success('Blog added successfully!', {
        duration: 1000,
      });

      // Clear the form after successful submission
      setTitle('');
      setDescription('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.response);
      } else {
        console.error('Error adding blog:', error);
      }
    }
  };

  return (
    <section>
        <header>
            <Header />
        </header>
        <div className={`${styles.container}`}>
        <div className={`container mx-auto my-8 p-8 bg-white text-gray-800 rounded-lg shadow-md max-w-lg`}>
        <Toaster position='top-center' reverseOrder={false}></Toaster>
        <h2 className="text-2xl font-bold mb-4">Add a new blog</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Title:</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-md text-gray-800"
                placeholder="Enter the title"
            />
            </div>
            <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Description:</label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded-md text-gray-800"
                placeholder="Enter the description"
            />
            </div>
            <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
            Add Blog
            </button>
        </form>
        </div>
        </div>
        <footer>
            <Footer />
        </footer>
    </section>
    
  );
}

export default AddBlog;
