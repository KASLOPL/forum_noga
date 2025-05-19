import React from 'react';
import './addquestion.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function AddQuestion() {

  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
      navigate('/'); // przekierowanie do strony logowania
    }
  }, [navigate]);

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <h2>Snapsolve</h2>
        <ul>
          <li><button onClick={() => navigate('/addquestion')}>Add question</button></li>
          <li><button onClick={() => navigate('/main')}>Home</button></li>
          <li>Notifications</li>
          <li>Specialists</li>
          <li>My Questions</li>
          <li><button onClick={() => navigate('/zakładki')}>Bookmarks</button></li>
          <li>Activity & Stats</li>
          <li><button onClick={() => navigate('/settings')}>Settings</button></li>
          <li>Help & FAQ</li>
        </ul>
        <div className="user-info">
          <p><strong>{currentUser?.name || 'Guest'}</strong><br />Student</p>
          <button onClick={handleLogout}>Sign out</button>
        </div>
      </aside>

      <main className="main-content">
        <div className="form-header">
          <h1>Ask a Specialist</h1>
          <div className="buttons">
            <button>Cancel</button>
            <button>Post</button>
          </div>
        </div>

        <form className="question-form">
          <label>
            Question Title*
            <input type="text" placeholder="Enter your question title" required />
          </label>

          <label>
            Caption*
            <textarea placeholder="Write the question caption" required></textarea>
          </label>

          <label>
            Add Some Tags
            <div className="tags">Java <span>Beginner</span> <span>Eclipse</span></div>
          </label>

          <label>
            Category*
            <select required>
              <option>Select Category</option>
            </select>
          </label>

          <label>
            Question Type
            <select>
              <option>Error in code</option>
              <option>I need a quick answer</option>
            </select>
          </label>

          <label>
            By when do you want to have the answer?
            <input type="date" />
          </label>

          <div className="file-upload">
            <p>Select File to Upload</p>
            <p>Supported formats: .pdf, .png, .jpg, .jpeg</p>
            <p>Max file: 10 MB</p>
            <input type="file" />
          </div>

          <button className="post-button">Post</button>
        </form>
      </main>
    </div>
  );
}

export default AddQuestion;
