import React, { useState } from 'react';
import './addquestion.css';
import {
  Home,
  Bell,
  Users,
  MessageSquare,
  Activity,
  Settings,
  HelpCircle,
  ChevronLeft,
  Calendar,
  Upload,
  AlertCircle,
  ChevronDown,
  Fingerprint,
  PlusSquare
} from 'lucide-react';

const AddQuestion = () => {
  const [questionTitle, setQuestionTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedQuestionType, setSelectedQuestionType] = useState('Error in code');
  const [needQuickAnswer, setNeedQuickAnswer] = useState(false);
  const [answerDate, setAnswerDate] = useState('');
  const [tags, setTags] = useState(['Java', 'Beginner', 'Eclipse']);

  const sidebarItems = [
    { icon: <Home size={20} />, label: 'Home', active: true },
    { icon: <Bell size={20} />, label: 'Notifications', active: false },
    { icon: <Users size={20} />, label: 'Specialists', active: false },
    { icon: <MessageSquare size={20} />, label: 'My Questions', active: false },
    { icon: <Activity size={20} />, label: 'Activity & Stats', active: false },
    { icon: <Settings size={20} />, label: 'Settings', active: false },
    { icon: <HelpCircle size={20} />, label: 'Help & FAQ', active: false }
  ];

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="caloscAdd">
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-section">
          <div className="logo">
            <div className="logo-icon">⚡</div>
            <span className="logo-text">Snapsolve</span>
          </div>
        </div>

        <div className="sidebar-content">
          <div className="add-question-btn">
            <div className="add-question-icon">
              <PlusSquare size={24} />
            </div>
            <span>ADD QUESTION</span>
          </div>
          
          <nav className="nav-menu">
            {sidebarItems.map((item, index) => (
              <div key={index} className={`nav-item ${item.active ? 'active' : ''}`}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </div>
            ))}
          </nav>
        </div>

        <div className="user-profile">
          <div className="user-info">
            <div className="user-avatar">BK</div>
            <div className="user-details">
              <div className="user-name">Basjan Kojko</div>
              <div className="user-role">Student</div>
            </div>
          </div>
          <button className="sign-out-btn">Sign out</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <button className="back-btn">
              <ChevronLeft size={20} />
            </button>
            <span className="page-title">Add Question</span>
          </div>
          <div className="header-right">
            <button className="cancel-btn">Cancel</button>
            <button className="post-btn">Post</button>
          </div>
        </div>

        {/* Form Content */}
        <div className="content-wrapper">
          <div className="form-container">
            <div className="form-header">
              <h1>Ask a Specialist</h1>
              <p className="form-description">
                Need help with your code? Ask an expert and get a quick answer! You can{' '}
                <span className="highlight">attach a code file</span>, select a question type, and{' '}
                <span className="highlight">mark it as urgent</span>.
              </p>
            </div>

            <form className="question-form">
              {/* Question Title */}
              <div className="form-group">
                <label className="form-label">
                  Question Title<span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <Fingerprint size={16} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your question title"
                    value={questionTitle}
                    onChange={(e) => setQuestionTitle(e.target.value)}
                  />
                </div>
              </div>

              {/* Caption */}
              <div className="form-group">
                <label className="form-label">
                  Caption<span className="required">*</span>
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Write the question caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={6}
                />
                <div className="character-count">0/500 Characters</div>
              </div>

              {/* Tags */}
              <div className="form-group">
                <label className="form-label">
                  Add Some Tags <span className="min-tags">(min. 1)</span><span className="required">*</span>
                </label>
                <div className="tags-container">
                  {tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                      <button 
                        type="button" 
                        className="tag-remove"
                        onClick={() => removeTag(tag)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button type="button" className="add-tag-btn">
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">
                  Category<span className="required">*</span>
                </label>
                <div className="select-wrapper">
                  <select
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    <option value="programming">Programming</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-development">Mobile Development</option>
                  </select>
                  <ChevronDown size={16} />
                </div>
              </div>

              {/* Question Type */}
              <div className="form-group">
                <label className="form-label">Question Type</label>
                <div className="select-wrapper">
                  <select
                    className="form-select question-type-select"
                    value={selectedQuestionType}
                    onChange={(e) => setSelectedQuestionType(e.target.value)}
                  >
                    <option value="Error in code">Error in code</option>
                    <option value="General question">General question</option>
                    <option value="Code review">Code review</option>
                  </select>
                  <div className="question-type-icon">
                    <AlertCircle size={16} color="#da4747" />
                  </div>
                  <ChevronDown size={16} />
                </div>
              </div>

              {/* Quick Answer Checkbox */}
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={needQuickAnswer}
                    onChange={(e) => setNeedQuickAnswer(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  I need a quick answer
                </label>
              </div>

              {/* Answer Date */}
              <div className="form-group">
                <label className="form-label">By when do you want to have the answer?</label>
                <div className="input-wrapper date-wrapper">
                  <input
                    type="text"
                    className="form-input date-input"
                    placeholder="dd/mm/yyyy"
                    value={answerDate}
                    onChange={(e) => setAnswerDate(e.target.value)}
                  />
                  <Calendar size={16} />
                </div>
              </div>
            </form>
          </div>

          {/* File Upload Section */}
          <div className="file-upload-section">
            <div className="file-upload-area">
              <div className="upload-icon">
                <Upload size={32} />
              </div>
              <div className="upload-content">
                <div className="upload-title">Select File to Upload</div>
                <div className="upload-formats">
                  Supported formats:<br />
                  .java, .py, .cpp, .js, .txt, .zip
                </div>
                <div className="upload-size">Max 10 MB</div>
                <button type="button" className="select-file-btn">
                  <Upload size={16} />
                  Select File
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="submit-section">
          <button type="submit" className="submit-btn">
            Post
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AddQuestion;