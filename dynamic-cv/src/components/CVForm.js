// CVForm.js
import React, { useState, useEffect } from 'react';

function CVForm({ cvData, setCvData, onSave, onReset }) {
  const [personal, setPersonal] = useState({
    name: cvData.name || '',
    email: cvData.email || '',
    phone: cvData.phone || '',
    address: cvData.address || '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [eduInputs, setEduInputs] = useState({
    degree: '',
    institution: '',
    gradYear: '',
  });

  const [expInputs, setExpInputs] = useState({
    jobTitle: '',
    company: '',
    fromMonth: '',
    fromYear: '',
    toMonth: '',
    toYear: '',
    responsibilities: '',
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    localStorage.setItem('cvData', JSON.stringify(cvData));
  }, [cvData]);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!emailRegex.test(value)) {
          error = 'Invalid email address';
        }
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone is required';
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonal((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
    setCvData({ ...cvData, [name]: value });
  };

  const handleEduInputChange = (e) => {
    const { name, value } = e.target;
    setEduInputs({ ...eduInputs, [name]: value });
  };

  const addEducation = () => {
    const { degree, institution, gradYear } = eduInputs;
    if (!degree || !institution || !gradYear) {
      alert('Please fill all education fields');
      return;
    }
    const newEdu = { id: Date.now(), degree, institution, gradYear };
    setCvData({ ...cvData, education: [...cvData.education, newEdu] });
    setEduInputs({ degree: '', institution: '', gradYear: '' });
  };

  const handleExpInputChange = (e) => {
    const { name, value } = e.target;
    setExpInputs({ ...expInputs, [name]: value });
  };

  const addExperience = () => {
    const { jobTitle, company, fromMonth, fromYear, toMonth, toYear, responsibilities } = expInputs;

    if (!jobTitle || !company || !fromMonth || !fromYear || !toMonth || !toYear) {
      alert('Please fill all experience fields');
      return;
    }

    const duration = `${fromMonth} ${fromYear} - ${toMonth} ${toYear}`;
    const newExp = {
      id: Date.now(),
      jobTitle,
      company,
      duration,
      responsibilities,
    };

    setCvData({ ...cvData, experience: [...cvData.experience, newExp] });

    setExpInputs({
      jobTitle: '',
      company: '',
      fromMonth: '',
      fromYear: '',
      toMonth: '',
      toYear: '',
      responsibilities: '',
    });
  };

  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill) {
      alert('Please enter a skill before adding.');
      return;
    }
    if (cvData.skills.includes(skill)) {
      alert('This skill is already added.');
      return;
    }
    setCvData({ ...cvData, skills: [...cvData.skills, skill] });
    setSkillInput('');
  };

  const handleReset = () => {
    const confirmReset = window.confirm('Are you sure you want to reset your CV? This will clear all fields.');
    if (!confirmReset) return;

    setPersonal({
      name: '',
      email: '',
      phone: '',
      address: '',
    });
    setEduInputs({
      degree: '',
      institution: '',
      gradYear: '',
    });
    setExpInputs({
      jobTitle: '',
      company: '',
      fromMonth: '',
      fromYear: '',
      toMonth: '',
      toYear: '',
      responsibilities: '',
    });
    setSkillInput('');
    setErrors({
      name: '',
      email: '',
      phone: '',
    });
    onReset();
  };

  const handleSave = () => {
    const isNameValid = validateField('name', personal.name);
    const isEmailValid = validateField('email', personal.email);
    const isPhoneValid = validateField('phone', personal.phone);

    if (isNameValid && isEmailValid && isPhoneValid) {
      onSave();
    } else {
      alert('Please fix the errors in the form before saving.');
    }
  };

  return (
    <form className="cv-form" onSubmit={(e) => e.preventDefault()}>
      <h2>Personal Information</h2>
      <input
        type="text"
        name="name"
        value={personal.name}
        onChange={handlePersonalChange}
        placeholder="Name"
      />
      {errors.name && <p className="error">{errors.name}</p>}

      <input
        type="email"
        name="email"
        value={personal.email}
        onChange={handlePersonalChange}
        placeholder="Email"
      />
      {errors.email && <p className="error">{errors.email}</p>}

      <input
        type="tel"
        name="phone"
        value={personal.phone}
        onChange={handlePersonalChange}
        placeholder="Phone"
      />
      {errors.phone && <p className="error">{errors.phone}</p>}

      <input
        type="text"
        name="address"
        value={personal.address}
        onChange={handlePersonalChange}
        placeholder="Address"
      />

      <h2>Education</h2>
      <input
        type="text"
        name="degree"
        value={eduInputs.degree}
        onChange={handleEduInputChange}
        placeholder="Degree"
      />
      <input
        type="text"
        name="institution"
        value={eduInputs.institution}
        onChange={handleEduInputChange}
        placeholder="Institution"
      />
      <input
        type="text"
        name="gradYear"
        value={eduInputs.gradYear}
        onChange={handleEduInputChange}
        placeholder="Year of Completion"
      />
      <button type="button" onClick={addEducation}>
        Add Education
      </button>

      <h2>Experience</h2>
      <input
        type="text"
        name="jobTitle"
        value={expInputs.jobTitle}
        onChange={handleExpInputChange}
        placeholder="Job Title"
      />
      <input
        type="text"
        name="company"
        value={expInputs.company}
        onChange={handleExpInputChange}
        placeholder="Company"
      />

      <div className="duration-inputs" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input
          type="text"
          name="fromMonth"
          value={expInputs.fromMonth}
          onChange={handleExpInputChange}
          placeholder="From Month (e.g. Jan)"
        />
        <input
          type="text"
          name="fromYear"
          value={expInputs.fromYear}
          onChange={handleExpInputChange}
          placeholder="From Year (e.g. 2020)"
        />
        <input
          type="text"
          name="toMonth"
          value={expInputs.toMonth}
          onChange={handleExpInputChange}
          placeholder="To Month (e.g. Dec)"
        />
        <input
          type="text"
          name="toYear"
          value={expInputs.toYear}
          onChange={handleExpInputChange}
          placeholder="To Year (e.g. 2021)"
        />
      </div>

      <textarea
        name="responsibilities"
        value={expInputs.responsibilities}
        onChange={handleExpInputChange}
        placeholder="Responsibilities"
      />
      <button type="button" onClick={addExperience}>
        Add Experience
      </button>

      <h2>Skills</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input
          type="text"
          name="skillInput"
          value={skillInput}
          onChange={handleSkillInputChange}
          placeholder="Add a skill"
        />
        <button type="button" onClick={addSkill}>
          Add Skill
        </button>
      </div>

      <div className="form-buttons" style={{ marginTop: '20px' }}>
        <button type="button" onClick={handleSave}>
          Save CV
        </button>
        <button type="button" onClick={handleReset}>
          Reset CV
        </button>
      </div>
    </form>
  );
}

export default CVForm;
