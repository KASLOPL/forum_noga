import React from 'react';
import { useNavigate } from 'react-router-dom';

function Main() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', borderRight: '1px solid #ccc', padding: '20px' }}>
        <h2>SnapSolve</h2>
        <button>Add question</button><br /><br />
        <button>Home</button><br /><br />
        <button>Notifications</button><br /><br />
        <button>Specialist</button><br /><br />
        <button>My Questions</button><br /><br />
        <button>Bookmarks</button><br /><br />
        <button>Settings</button><br /><br />
        <button>Help & FAQ</button><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <button onClick={handleLogout}>Sign out</button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Hi, {currentUser?.name || 'Guest'}!</h1>
        <p>Stuck on a question? SnapSolve connects you with experts for fast, accurate answers—no stress, just solutions!</p>

        {/* Posts */}
        <div style={{ marginTop: '30px' }}>
          <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '15px' }}>
            <p>Post Title Placeholder</p>
            <p>Tags: [tag1] [tag2]</p>
            <p>Short description of the post...</p>
            <p>❤️ 23 👁️ 1284</p>
          </div>

          <div style={{ border: '1px solid #ccc', padding: '10px' }}>
            <p>Post Title Placeholder</p>
            <p>Tags: [tag3] [tag4]</p>
            <p>Another post description...</p>
            <p>❤️ 23 👁️ 1284</p>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div style={{ width: '200px', borderLeft: '1px solid #ccc', padding: '20px' }}>
        <h3>Top Experts</h3>
        <ul>
          <li>Anonymous</li>
          <li>Anonymous</li>
          <li>Anonymous</li>
        </ul>

        <h3>Popular Tags</h3>
        <ul>
          <li>Python</li>
          <li>GitHub</li>
          <li>Data Structures</li>
          <li>React.js</li>
          <li>Java</li>
          <li>JavaScript</li>
        </ul>
      </div>
    </div>
  );
}

export default Main;
