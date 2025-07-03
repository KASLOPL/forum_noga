import React, { useState, useEffect } from "react";
import "./edit_profile.css";

// SVG Icons
const ArrowLeftIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const UploadIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

const PlusIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const EditProfile = ({ currentUser, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    school: "",
    fieldOfStudy: "",
    bio: "",
  });

  const [schoolDropdownOpen, setSchoolDropdownOpen] = useState(false);
  const [studyDropdownOpen, setStudyDropdownOpen] = useState(false);

  const schoolOptions = [
    "Uniwersytet Warszawski",
    "Politechnika Warszawska",
    "Szkoła Główna Handlowa",
    "Uniwersytet Jagielloński",
    "Politechnika Krakowska",
    "Uniwersytet Wrocławski",
    "Politechnika Gdańska",
    "Uniwersytet im. Adama Mickiewicza"
  ];

  const studyOptions = [
    "Informatyka",
    "Inżynieria Oprogramowania",
    "Zarządzanie",
    "Ekonomia",
    "Matematyka",
    "Fizyka",
    "Chemia",
    "Biologia",
    "Psychologia",
    "Prawo",
    "Medycyna",
    "Architektura"
  ];

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.userName || currentUser.name || "",
        school: currentUser.school || "",
        fieldOfStudy: currentUser.fieldOfStudy || "",
        bio: currentUser.bio || "",
      });
    }
  }, [currentUser]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Nazwa jest wymagana!");
      return;
    }

    onSave(formData);
  };

  const handleImageUpload = () => {
    console.log("Upload image clicked");
  };

  const getUserInitials = () => {
    const name = formData.name || currentUser?.userName || currentUser?.name || "Guest";
    return name === "Guest" ? "GU" : name.substring(0, 2).toUpperCase();
  };

  const handleSchoolSelect = (school) => {
    handleInputChange("school", school);
    setSchoolDropdownOpen(false);
  };

  const handleStudySelect = (study) => {
    handleInputChange("fieldOfStudy", study);
    setStudyDropdownOpen(false);
  };

  return (
    <div className="predit">
    <div className="profile-editor">
      <div className="profile-container">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <button className="back-button" onClick={onClose}>
              <ArrowLeftIcon />
            </button>
            <h1 className="header-title">Edit Your Profile</h1>
          </div>
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        </div>

        <div className="content">
          {/* Avatar Section */}
          <div className="section">
            <label className="label">Avatar</label>
            <div className="avatar-container">
              <div className="avatar-wrapper">
                <div className="avatar">{getUserInitials()}</div>
                <button className="avatar-plus" onClick={handleImageUpload}>
                  <PlusIcon />
                </button>
              </div>
              <div className="upload-section">
                <button className="upload-button" onClick={handleImageUpload}>
                  <UploadIcon />
                  Upload new image
                </button>
                <div className="upload-info">
                  At least 800x800 px recommended
                  <br />
                  JPG or PNG is allowed
                </div>
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div className="section">
            <label className="label" htmlFor="name">
              Name *
            </label>
            <input
              id="name"
              type="text"
              className="input"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          {/* School and Field of Study */}
          <div className="section">
            <div className="grid-two">
              <div className="dropdown-container">
                <label className="label" htmlFor="school">
                  School/University
                </label>
                <div className="dropdown-wrapper">
                  <input
                    id="school"
                    type="text"
                    className="input dropdown-input"
                    value={formData.school}
                    onChange={(e) => handleInputChange("school", e.target.value)}
                    placeholder="Enter your school"
                    onClick={() => setSchoolDropdownOpen(!schoolDropdownOpen)}
                  />
                  <button 
                    className="dropdown-arrow"
                    onClick={() => setSchoolDropdownOpen(!schoolDropdownOpen)}
                  >
                    <ChevronDownIcon />
                  </button>
                  {schoolDropdownOpen && (
                    <div className="dropdown-menu">
                      {schoolOptions.map((school, index) => (
                        <div
                          key={index}
                          className="dropdown-item"
                          onClick={() => handleSchoolSelect(school)}
                        >
                          {school}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="dropdown-container">
                <label className="label" htmlFor="fieldOfStudy">
                  Field of Study
                </label>
                <div className="dropdown-wrapper">
                  <input
                    id="fieldOfStudy"
                    type="text"
                    className="input dropdown-input"
                    value={formData.fieldOfStudy}
                    onChange={(e) => handleInputChange("fieldOfStudy", e.target.value)}
                    placeholder="Enter your field of study"
                    onClick={() => setStudyDropdownOpen(!studyDropdownOpen)}
                  />
                  <button 
                    className="dropdown-arrow"
                    onClick={() => setStudyDropdownOpen(!studyDropdownOpen)}
                  >
                    <ChevronDownIcon />
                  </button>
                  {studyDropdownOpen && (
                    <div className="dropdown-menu">
                      {studyOptions.map((study, index) => (
                        <div
                          key={index}
                          className="dropdown-item"
                          onClick={() => handleStudySelect(study)}
                        >
                          {study}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="section">
            <label className="label" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              className="textarea"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell us about yourself..."
              rows="4"
            />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default EditProfile;