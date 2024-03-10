import React, { useEffect, useState } from 'react';
import styles from '../styles/BlogHome.module.css';
import Header from './Header';
import Footer from './Footer';
import BlogCard from './BlogCard';
import { fetchBlogs } from '../helper/blogHelper';
import toast, {Toaster} from 'react-hot-toast';

function BlogHome() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedBlogs = await fetchBlogs();
        setBlogs(fetchedBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchData();
  }, []);

  const handleCardError = (errorMessage) => {
    toast.error(errorMessage, {
      duration: 3000,
    });
  };

  return (
    <section>
      <header>
        <Header />
      </header>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className={`mx-auto ${styles.blogContainer} ${styles.container} `}>
        <div className={`${styles.main}`}>
          <div className={`flex flex-wrap justify-center ${styles.blogList} `}>
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} onError={handleCardError}/>
          ))}
          </div>
        </div>
      </div>
      <footer>
        <Footer />
      </footer>
    </section>
    
  );
}

export default BlogHome;
