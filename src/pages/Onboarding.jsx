import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { generateCareerPaths } from '../services/gemini';
import './Onboarding.css';

const STEPS = [
  { id: 1, title: 'About You', icon: 'user' },
  { id: 2, title: 'Your Interests', icon: 'heart' },
  { id: 3, title: 'Skills & Strengths', icon: 'chart' },
  { id: 4, title: 'Dreams & Goals', icon: 'star' },
  { id: 5, title: 'Review & Launch', icon: 'rocket' },
];

const INTERESTS = [
  'Technology', 'Science', 'Arts', 'Business', 'Healthcare',
  'Engineering', 'Design', 'Education', 'Law', 'Sports',
  'Music', 'Writing', 'Mathematics', 'Psychology', 'Environment',
  'Social Work', 'Media', 'Finance', 'Architecture', 'Research',
];

const INTEREST_ICONS = {
  Technology: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
  ),
  Science: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3v7.4a2 2 0 0 1-.6 1.4L3 17.6a2 2 0 0 0-.6 1.4V20a1 1 0 0 0 1 1h17.2a1 1 0 0 0 1-1v-1a2 2 0 0 0-.6-1.4l-5.4-5.8a2 2 0 0 1-.6-1.4V3"/><path d="M9 3h6"/></svg>
  ),
  Arts: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="19" cy="13" r="2"/><circle cx="7" cy="14" r="2.5"/><circle cx="13" cy="19" r="2"/><path d="M12 2a10 10 0 1 0 10 10A4 4 0 0 0 18 8a4 4 0 0 0-4-4"/></svg>
  ),
  Business: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
  ),
  Healthcare: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
  ),
  Engineering: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
  ),
  Design: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
  ),
  Education: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/></svg>
  ),
  Law: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M4 7l8-4 8 4"/><path d="M4 7v4a4 4 0 0 0 4 4h0"/><path d="M20 7v4a4 4 0 0 1-4 4h0"/><path d="M8 21h8"/></svg>
  ),
  Sports: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
  ),
  Music: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
  ),
  Writing: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
  ),
  Mathematics: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h8M4 18h16"/><path d="M16 12l2 2 2-2M16 16l2-2 2 2"/></svg>
  ),
  Psychology: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a8 8 0 0 1 8 8c0 3.5-2 6-4 7.5V20a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.5C6 16 4 13.5 4 10a8 8 0 0 1 8-8z"/><path d="M10 20h4"/></svg>
  ),
  Environment: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 8c.7-1 1-2.2 1-3.5 0-2.5-2-4.5-4.5-4.5S9 2 9 4.5C9 5.8 9.3 7 10 8"/><path d="M12 8v13"/><path d="M6 16c-2 0-4 1-4 3.5S6 23 6 23h12s4-1 4-3.5S18 16 18 16"/></svg>
  ),
  'Social Work': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Media: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
  ),
  Finance: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  ),
  Architecture: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 21v-4h6v4"/><path d="M9 10h1M14 10h1M9 14h1M14 14h1"/></svg>
  ),
  Research: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
  ),
};

const SKILLS = [
  { id: 'analytical', label: 'Analytical Thinking', emoji: '🧠' },
  { id: 'creativity', label: 'Creativity', emoji: '🎨' },
  { id: 'communication', label: 'Communication', emoji: '💬' },
  { id: 'leadership', label: 'Leadership', emoji: '👑' },
  { id: 'problemSolving', label: 'Problem Solving', emoji: '🧩' },
  { id: 'technical', label: 'Technical Skills', emoji: '⚙️' },
];

function getSliderColor(value) {
  if (value <= 3) return '#ef4444';
  if (value <= 5) return '#f59e0b';
  if (value <= 7) return '#22c55e';
  return '#10b981';
}

function getSliderGradient(value) {
  const pct = ((value - 1) / 9) * 100;
  const color = getSliderColor(value);
  return `linear-gradient(90deg, ${color} 0%, ${color} ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
}

const StepIcon = ({ icon, filled }) => {
  const color = filled ? 'currentColor' : 'currentColor';
  const sw = '2';
  switch (icon) {
    case 'user':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'heart':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={sw}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    case 'chart':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}>
          <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
      );
    case 'star':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={sw}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      );
    case 'rocket':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}>
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      );
    default:
      return null;
  }
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { setProfile, setCareerPaths } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [fadeClass, setFadeClass] = useState('onb-fade-in');
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    education: '',
    location: '',
    interests: [],
    skills: {
      analytical: 5,
      creativity: 5,
      communication: 5,
      leadership: 5,
      problemSolving: 5,
      technical: 5,
    },
    dreamCareer: '',
    workStyle: '',
    priority: '',
  });

  const [errors, setErrors] = useState({});

  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  const animateStep = (nextStep) => {
    setFadeClass('onb-fade-out');
    setTimeout(() => {
      setCurrentStep(nextStep);
      setFadeClass('onb-fade-in');
    }, 300);
  };

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your name';
      if (!formData.age || formData.age < 14 || formData.age > 25)
        newErrors.age = 'Age must be between 14 and 25';
      if (!formData.education) newErrors.education = 'Please select your education level';
      if (!formData.location.trim()) newErrors.location = 'Please enter your location';
    }
    if (currentStep === 2) {
      if (formData.interests.length < 3)
        newErrors.interests = `Select at least 3 interests (${formData.interests.length}/3)`;
    }
    if (currentStep === 4) {
      if (!formData.dreamCareer.trim())
        newErrors.dreamCareer = 'Tell us about your dream career';
      if (!formData.workStyle) newErrors.workStyle = 'Please select a work style';
      if (!formData.priority) newErrors.priority = 'Please select a priority';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (currentStep < 5) animateStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) animateStep(currentStep - 1);
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
    setErrors((prev) => ({ ...prev, interests: undefined }));
  };

  const handleSkillChange = (skillId, value) => {
    setFormData((prev) => ({
      ...prev,
      skills: { ...prev.skills, [skillId]: parseInt(value, 10) },
    }));
  };

  const handleLaunch = async () => {
    setIsGenerating(true);
    try {
      const profile = {
        name: formData.fullName,
        age: formData.age,
        education: formData.education,
        location: formData.location,
        interests: formData.interests,
        skills: formData.skills,
        dream: formData.dreamCareer,
        workStyle: formData.workStyle,
        priority: formData.priority,
      };
      setProfile(profile);
      const result = await generateCareerPaths(profile);
      setCareerPaths(result);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error generating career paths:', error);
      navigate('/dashboard');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep1 = () => (
    <div className="onb-step-content">
      <div className="onb-step-header">
        <span className="onb-step-emoji">👋</span>
        <h2 className="onb-step-title">Let's get to know you</h2>
        <p className="onb-step-desc">Tell us a bit about yourself so we can personalize your experience.</p>
      </div>
      <div className="onb-form-grid">
        <div className="onb-field">
          <label className="onb-label" htmlFor="fullName">Full Name</label>
          <div className="onb-input-wrap">
            <svg className="onb-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input
              id="fullName"
              type="text"
              className={`onb-input ${errors.fullName ? 'onb-input-error' : ''}`}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value });
                setErrors({ ...errors, fullName: undefined });
              }}
            />
          </div>
          {errors.fullName && <span className="onb-error">{errors.fullName}</span>}
        </div>
        <div className="onb-field">
          <label className="onb-label" htmlFor="age">Age</label>
          <div className="onb-input-wrap">
            <svg className="onb-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            <input
              id="age"
              type="number"
              className={`onb-input ${errors.age ? 'onb-input-error' : ''}`}
              placeholder="14 - 25"
              min="14"
              max="25"
              value={formData.age}
              onChange={(e) => {
                setFormData({ ...formData, age: e.target.value });
                setErrors({ ...errors, age: undefined });
              }}
            />
          </div>
          {errors.age && <span className="onb-error">{errors.age}</span>}
        </div>
        <div className="onb-field">
          <label className="onb-label" htmlFor="education">Current Education Level</label>
          <div className="onb-input-wrap">
            <svg className="onb-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/></svg>
            <select
              id="education"
              className={`onb-input onb-select ${errors.education ? 'onb-input-error' : ''}`}
              value={formData.education}
              onChange={(e) => {
                setFormData({ ...formData, education: e.target.value });
                setErrors({ ...errors, education: undefined });
              }}
            >
              <option value="">Select your level</option>
              <option value="High School">High School</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Graduate">Graduate</option>
              <option value="Post-Graduate">Post-Graduate</option>
            </select>
          </div>
          {errors.education && <span className="onb-error">{errors.education}</span>}
        </div>
        <div className="onb-field">
          <label className="onb-label" htmlFor="location">Location</label>
          <div className="onb-input-wrap">
            <svg className="onb-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <input
              id="location"
              type="text"
              className={`onb-input ${errors.location ? 'onb-input-error' : ''}`}
              placeholder="City, Country"
              value={formData.location}
              onChange={(e) => {
                setFormData({ ...formData, location: e.target.value });
                setErrors({ ...errors, location: undefined });
              }}
            />
          </div>
          {errors.location && <span className="onb-error">{errors.location}</span>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="onb-step-content">
      <div className="onb-step-header">
        <span className="onb-step-emoji">✨</span>
        <h2 className="onb-step-title">What sparks your curiosity?</h2>
        <p className="onb-step-desc">
          Select at least 3 areas that excite you. These help us map your ideal career paths.
        </p>
      </div>
      {errors.interests && <span className="onb-error onb-error-center">{errors.interests}</span>}
      <div className="onb-interest-count">
        <span className={formData.interests.length >= 3 ? 'onb-count-ok' : 'onb-count-low'}>
          {formData.interests.length}
        </span>{' '}
        / 3 minimum selected
      </div>
      <div className="onb-interests-grid">
        {INTERESTS.map((interest) => {
          const selected = formData.interests.includes(interest);
          return (
            <button
              key={interest}
              type="button"
              className={`onb-interest-tag ${selected ? 'onb-interest-selected' : ''}`}
              onClick={() => handleInterestToggle(interest)}
            >
              <span className="onb-interest-icon">{INTEREST_ICONS[interest]}</span>
              <span className="onb-interest-label">{interest}</span>
              {selected && (
                <svg className="onb-interest-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="onb-step-content">
      <div className="onb-step-header">
        <span className="onb-step-emoji">💪</span>
        <h2 className="onb-step-title">Rate your superpowers</h2>
        <p className="onb-step-desc">
          Drag the sliders to rate yourself honestly — there are no wrong answers!
        </p>
      </div>
      <div className="onb-skills-list">
        {SKILLS.map((skill) => {
          const val = formData.skills[skill.id];
          const color = getSliderColor(val);
          return (
            <div key={skill.id} className="onb-skill-item">
              <div className="onb-skill-header">
                <span className="onb-skill-emoji">{skill.emoji}</span>
                <span className="onb-skill-label">{skill.label}</span>
                <span
                  className="onb-skill-value"
                  style={{ color, borderColor: color }}
                >
                  {val}
                </span>
              </div>
              <div className="onb-slider-wrap">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={val}
                  className="onb-slider"
                  style={{ background: getSliderGradient(val) }}
                  onChange={(e) => handleSkillChange(skill.id, e.target.value)}
                />
                <div className="onb-slider-labels">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="onb-step-content">
      <div className="onb-step-header">
        <span className="onb-step-emoji">🚀</span>
        <h2 className="onb-step-title">Dream big, aim higher</h2>
        <p className="onb-step-desc">
          Share your aspirations and preferences — we'll factor these into your career map.
        </p>
      </div>
      <div className="onb-dreams-form">
        <div className="onb-field onb-field-full">
          <label className="onb-label" htmlFor="dreamCareer">Describe your dream career in 2-3 sentences</label>
          <textarea
            id="dreamCareer"
            className={`onb-textarea ${errors.dreamCareer ? 'onb-input-error' : ''}`}
            rows="4"
            placeholder="I dream of working on projects that combine technology and creativity to solve real-world problems..."
            value={formData.dreamCareer}
            onChange={(e) => {
              setFormData({ ...formData, dreamCareer: e.target.value });
              setErrors({ ...errors, dreamCareer: undefined });
            }}
          />
          {errors.dreamCareer && <span className="onb-error">{errors.dreamCareer}</span>}
        </div>

        <div className="onb-field onb-field-full">
          <label className="onb-label">Preferred Work Style</label>
          {errors.workStyle && <span className="onb-error">{errors.workStyle}</span>}
          <div className="onb-radio-group">
            {[
              { value: 'Remote', icon: '🏠', desc: 'Work from anywhere' },
              { value: 'Hybrid', icon: '🔄', desc: 'Mix of office & home' },
              { value: 'On-site', icon: '🏢', desc: 'Traditional office' },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`onb-radio-card ${formData.workStyle === opt.value ? 'onb-radio-selected' : ''}`}
              >
                <input
                  type="radio"
                  name="workStyle"
                  value={opt.value}
                  checked={formData.workStyle === opt.value}
                  onChange={(e) => {
                    setFormData({ ...formData, workStyle: e.target.value });
                    setErrors({ ...errors, workStyle: undefined });
                  }}
                />
                <span className="onb-radio-icon">{opt.icon}</span>
                <span className="onb-radio-value">{opt.value}</span>
                <span className="onb-radio-desc">{opt.desc}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="onb-field onb-field-full">
          <label className="onb-label">What matters most to you?</label>
          {errors.priority && <span className="onb-error">{errors.priority}</span>}
          <div className="onb-radio-group onb-radio-group-4">
            {[
              { value: 'High Salary', icon: '💰', desc: 'Financial growth' },
              { value: 'Work-Life Balance', icon: '⚖️', desc: 'Personal time' },
              { value: 'Social Impact', icon: '🌍', desc: 'Make a difference' },
              { value: 'Innovation', icon: '💡', desc: 'Push boundaries' },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`onb-radio-card ${formData.priority === opt.value ? 'onb-radio-selected' : ''}`}
              >
                <input
                  type="radio"
                  name="priority"
                  value={opt.value}
                  checked={formData.priority === opt.value}
                  onChange={(e) => {
                    setFormData({ ...formData, priority: e.target.value });
                    setErrors({ ...errors, priority: undefined });
                  }}
                />
                <span className="onb-radio-icon">{opt.icon}</span>
                <span className="onb-radio-value">{opt.value}</span>
                <span className="onb-radio-desc">{opt.desc}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="onb-step-content">
      <div className="onb-step-header">
        <span className="onb-step-emoji">🎯</span>
        <h2 className="onb-step-title">Your Profile Summary</h2>
        <p className="onb-step-desc">
          Everything looks great! Review your details below, then launch your personalized career explorer.
        </p>
      </div>
      <div className="onb-review-card">
        <div className="onb-review-section">
          <h3 className="onb-review-heading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            About You
          </h3>
          <div className="onb-review-grid">
            <div className="onb-review-item">
              <span className="onb-review-label">Name</span>
              <span className="onb-review-value">{formData.fullName || '—'}</span>
            </div>
            <div className="onb-review-item">
              <span className="onb-review-label">Age</span>
              <span className="onb-review-value">{formData.age || '—'}</span>
            </div>
            <div className="onb-review-item">
              <span className="onb-review-label">Education</span>
              <span className="onb-review-value">{formData.education || '—'}</span>
            </div>
            <div className="onb-review-item">
              <span className="onb-review-label">Location</span>
              <span className="onb-review-value">{formData.location || '—'}</span>
            </div>
          </div>
        </div>

        <div className="onb-review-divider" />

        <div className="onb-review-section">
          <h3 className="onb-review-heading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            Interests
          </h3>
          <div className="onb-review-tags">
            {formData.interests.length > 0
              ? formData.interests.map((i) => (
                  <span key={i} className="onb-review-tag">{i}</span>
                ))
              : <span className="onb-review-empty">No interests selected</span>}
          </div>
        </div>

        <div className="onb-review-divider" />

        <div className="onb-review-section">
          <h3 className="onb-review-heading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
            Skills & Strengths
          </h3>
          <div className="onb-review-skills">
            {SKILLS.map((skill) => {
              const val = formData.skills[skill.id];
              const color = getSliderColor(val);
              return (
                <div key={skill.id} className="onb-review-skill">
                  <span className="onb-review-skill-label">
                    {skill.emoji} {skill.label}
                  </span>
                  <div className="onb-review-bar-bg">
                    <div
                      className="onb-review-bar-fill"
                      style={{
                        width: `${(val / 10) * 100}%`,
                        background: color,
                      }}
                    />
                  </div>
                  <span className="onb-review-skill-val" style={{ color }}>
                    {val}/10
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="onb-review-divider" />

        <div className="onb-review-section">
          <h3 className="onb-review-heading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
            Dreams & Goals
          </h3>
          <div className="onb-review-dreams">
            <div className="onb-review-dream-text">
              <span className="onb-review-label">Dream Career</span>
              <p className="onb-review-value onb-review-quote">
                {formData.dreamCareer || '—'}
              </p>
            </div>
            <div className="onb-review-grid">
              <div className="onb-review-item">
                <span className="onb-review-label">Work Style</span>
                <span className="onb-review-value onb-review-badge">
                  {formData.workStyle || '—'}
                </span>
              </div>
              <div className="onb-review-item">
                <span className="onb-review-label">Priority</span>
                <span className="onb-review-value onb-review-badge">
                  {formData.priority || '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const stepRenderers = [null, renderStep1, renderStep2, renderStep3, renderStep4, renderStep5];

  return (
    <div className="onb-page">
      {/* Ambient background effects */}
      <div className="onb-bg-orb onb-bg-orb-1" />
      <div className="onb-bg-orb onb-bg-orb-2" />
      <div className="onb-bg-orb onb-bg-orb-3" />

      {/* Top progress bar */}
      <div className="onb-progress-bar-top">
        <div
          className="onb-progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="onb-container">
        {/* Sidebar */}
        <aside className="onb-sidebar">
          <div className="onb-sidebar-header">
            <div className="onb-logo">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="url(#logoGrad)" strokeWidth="2" />
                <path d="M10 16l4 4 8-8" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
                    <stop stopColor="#00d4ff" />
                    <stop offset="1" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="onb-logo-text">DISHA AI</span>
            </div>
            <p className="onb-sidebar-tagline">Setting up your future</p>
          </div>

          <nav className="onb-steps-nav">
            {STEPS.map((step) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              let stateClass = 'onb-step-upcoming';
              if (isCompleted) stateClass = 'onb-step-completed';
              if (isCurrent) stateClass = 'onb-step-current';

              return (
                <div key={step.id} className={`onb-step-nav-item ${stateClass}`}>
                  <div className="onb-step-indicator">
                    {isCompleted ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <StepIcon icon={step.icon} filled={isCurrent} />
                    )}
                  </div>
                  <div className="onb-step-nav-text">
                    <span className="onb-step-nav-label">Step {step.id}</span>
                    <span className="onb-step-nav-title">{step.title}</span>
                  </div>
                  {step.id < STEPS.length && <div className="onb-step-connector" />}
                </div>
              );
            })}
          </nav>

          <div className="onb-sidebar-footer">
            <div className="onb-sidebar-progress-text">
              {Math.round(progressPercent)}% complete
            </div>
          </div>
        </aside>

        {/* Main form area */}
        <main className="onb-main">
          <div className="onb-form-card">
            <div className={`onb-step-wrapper ${fadeClass}`}>
              {stepRenderers[currentStep]()}
            </div>

            <div className="onb-actions">
              {currentStep > 1 && (
                <button type="button" className="onb-btn onb-btn-back" onClick={handleBack}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              )}
              <div className="onb-actions-spacer" />
              {currentStep < 5 ? (
                <button type="button" className="onb-btn onb-btn-next" onClick={handleNext}>
                  Continue
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button type="button" className="onb-btn onb-btn-launch" onClick={handleLaunch} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <svg className="onb-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Generating Your Futures...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                      </svg>
                      Launch My Future Explorer
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
