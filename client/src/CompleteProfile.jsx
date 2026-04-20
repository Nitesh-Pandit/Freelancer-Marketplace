import React, { useState } from 'react';
import './CompleteProfile.css';

function CompleteProfile({ user, token, onProfileComplete }) {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [about, setAbout] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (!trimmedSkill) {
      setError('Please enter a skill');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (skills.some(s => s.toLowerCase() === trimmedSkill.toLowerCase())) {
      setError('This skill is already added');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setSkills([...skills, trimmedSkill]);
    setSkillInput('');
    setError('');
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (skills.length === 0) {
      setError('Please add at least one skill');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/complete-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          skills,
          about,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        setError(data.error || 'Failed to complete profile');
        return;
      }

      setLoading(false);
      setSuccess('Profile completed successfully!');

      // Redirect to home after 2 seconds
      setTimeout(() => {
        onProfileComplete(data.user);
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError('Server error. Please try again.');
      console.error('Complete profile error:', err);
    }
  };

  return (
    <div className="complete-profile-wrapper">
      <div className="complete-profile-container">
        {/* LEFT SIDE - VISUAL SECTION */}
        <div className="profile-left">
          <div className="left-content">
            <div className="step-indicator">
              <span className="step-number">Step 1</span>
              <span className="step-label">Complete Your Profile</span>
            </div>
            
            <div className="profile-illustration-wrapper">
              <div className="profile-illustration">✨</div>
              <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
              </div>
            </div>

            <h2>Showcase Your Skills</h2>
            <p>Build a complete profile to attract more clients and land better projects</p>
            
            <div className="benefits-list">
              <div className="benefit-item">
                <span className="benefit-icon">🎯</span>
                <span className="benefit-text">Get matched with relevant projects</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">💼</span>
                <span className="benefit-text">Increase your visibility</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">⭐</span>
                <span className="benefit-text">Build your reputation</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM SECTION */}
        <div className="profile-right">
          <form onSubmit={handleSubmit}>
            <div className="form-wrapper">
              {/* MESSAGES */}
              {error && (
                <div className="alert alert-error">
                  <span className="alert-icon">⚠️</span>
                  <span className="alert-text">{error}</span>
                </div>
              )}
              {success && (
                <div className="alert alert-success">
                  <span className="alert-icon">✅</span>
                  <span className="alert-text">{success}</span>
                </div>
              )}

              {/* USER INFO CARD */}
              <div className="info-card">
                <div className="card-header">
                  <h3 className="card-title">Your Information</h3>
                </div>
                <div className="user-details-grid">
                  <div className="detail-box">
                    <label className="detail-label">Full Name</label>
                    <p className="detail-value">{user.name}</p>
                  </div>
                  <div className="detail-box">
                    <label className="detail-label">Email</label>
                    <p className="detail-value">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* SKILLS CARD */}
              <div className="info-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="title-icon">🛠️</span>
                    Your Skills
                  </h3>
                  <p className="card-subtitle">Add your professional skills (required)</p>
                </div>

                <div className="skill-input-container">
                  <div className="skill-input-wrapper">
                    <input
                      type="text"
                      placeholder="e.g., React, JavaScript, UI Design"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setFocusedInput('skill')}
                      onBlur={() => setFocusedInput(null)}
                      className="skill-input"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="add-skill-btn"
                      title="Add skill"
                    >
                      <span className="btn-icon">+</span>
                      <span className="btn-text">Add Skill</span>
                    </button>
                  </div>
                </div>

                {/* SKILLS DISPLAY */}
                {skills.length > 0 && (
                  <div className="skills-container">
                    <div className="skills-grid">
                      {skills.map((skill, index) => (
                        <div key={index} className="skill-card" style={{animationDelay: `${index * 0.1}s`}}>
                          <div className="skill-content">
                            <span className="skill-text">{skill}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(index)}
                            className="skill-remove-btn"
                            title="Remove skill"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="skills-info">
                      <span className="skills-count">
                        {skills.length} {skills.length === 1 ? 'skill' : 'skills'} added
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ABOUT SECTION CARD */}
              <div className="info-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="title-icon">📝</span>
                    About You
                  </h3>
                  <p className="card-subtitle">Tell clients about yourself (optional)</p>
                </div>

                <div className="about-input-wrapper">
                  <textarea
                    placeholder="Share your experience, strengths, and what makes you unique. Let clients know why you're the perfect fit for their projects..."
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    onFocus={() => setFocusedInput('about')}
                    onBlur={() => setFocusedInput(null)}
                    className={`about-textarea ${focusedInput === 'about' ? 'focused' : ''}`}
                    rows="6"
                    maxLength="500"
                  />
                  <div className="textarea-footer">
                    <span className="char-limit">{about.length}/500 characters</span>
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span>Completing Profile...</span>
                  </>
                ) : (
                  <>
                    <span className="btn-check-icon">✓</span>
                    <span>Complete Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompleteProfile;
