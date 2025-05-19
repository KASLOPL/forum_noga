import React from 'react';
import './addquestion.css';

function AddQuestion() {
  return (
    <div className="container">
      <aside className="sidebar">
        <h2>Snapsolve</h2>
        <ul>
          <li>Add Question</li>
          <li>Home</li>
          <li>Notifications</li>
          <li>Specialists</li>
          <li>My Questions</li>
          <li>Activity & Stats</li>
          <li>Settings</li>
          <li>Help & FAQ</li>
        </ul>
        <div className="user-info">
          <p><strong>Basjan Kojko</strong><br />Student</p>
          <button>Sign out</button>
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
