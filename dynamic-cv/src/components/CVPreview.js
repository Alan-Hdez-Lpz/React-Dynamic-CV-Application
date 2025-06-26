import React, { useState } from 'react';

function CVPreview({ cvData, setCvData }) {
  // Track which education/experience is currently being edited, null if none
  const [editingEduId, setEditingEduId] = useState(null);
  const [editingExpId, setEditingExpId] = useState(null);
  const [editingSkillId, setEditingSkillId] = useState(null);

  // Local state to hold edited data while editing
  const [eduEditData, setEduEditData] = useState({ degree: '', institution: '', gradYear: '' });
  const [expEditData, setExpEditData] = useState({ jobTitle: '', company: '', fromMonth: '', fromYear: '', toMonth: '', toYear: '', responsibilities: '' });
  const [skillEditData, setSkillEditData] = useState('');

  // Delete handlers
  const deleteEducation = (id) => {
    setCvData({
      ...cvData,
      education: cvData.education.filter((edu) => edu.id !== id),
    });
    // Clear edit if currently editing this entry
    if (editingEduId === id) setEditingEduId(null);
  };

  const deleteExperience = (id) => {
    setCvData({
      ...cvData,
      experience: cvData.experience.filter((exp) => exp.id !== id),
    });
    if (editingExpId === id) setEditingExpId(null);
  };

  // Delete a skill
  const deleteSkill = (id) => {
    setCvData({ ...cvData, skills: cvData.skills.filter((_, i) => i !== id) });
  };

  // Edit handlers
  const startEditEducation = (edu) => {
    setEditingEduId(edu.id);
    setEduEditData({ degree: edu.degree, institution: edu.institution, gradYear: edu.gradYear });
  };

  const startEditExperience = (exp) => {
     let fromMonth = '';
    let fromYear = '';
    let toMonth = '';
    let toYear = '';

    if (exp.duration) {
      const parts = exp.duration.split(' - ');
      if (parts.length === 2) {
        const [from, to] = parts;
        [fromMonth, fromYear] = from.split(' ');
        [toMonth, toYear] = to.split(' ');
      }
    }
    setEditingExpId(exp.id);
    setExpEditData({
      jobTitle: exp.jobTitle,
      company: exp.company,
      fromMonth: fromMonth || '',
      fromYear: fromYear || '',
      toMonth: toMonth || '',
      toYear: toYear || '',
      responsibilities: exp.responsibilities,
    });
  };

  const startEditSkill = (id) => {
    setEditingSkillId(id);
    setSkillEditData(cvData.skills[id]);
  };

  const handleEduEditChange = (e) => {
    const { name, value } = e.target;
    setEduEditData({ ...eduEditData, [name]: value });
  };

  const handleExpEditChange = (e) => {
    const { name, value } = e.target;
    setExpEditData({ ...expEditData, [name]: value });
  };

  const handleSkillEditChange = (e) => {
    setSkillEditData(e.target.value);
  };

  // Save edited education
  const saveEduEdit = () => {
    setCvData({
      ...cvData,
      education: cvData.education.map((edu) =>
        edu.id === editingEduId ? { ...edu, ...eduEditData } : edu
      ),
    });
    setEditingEduId(null);
  };

  // Save edited experience
  const saveExpEdit = () => {
     const { fromMonth, fromYear, toMonth, toYear, jobTitle, company, responsibilities } = expEditData;

    if (!jobTitle || !company || !fromMonth || !fromYear || !toMonth || !toYear) {
      alert('Please fill all experience fields');
      return;
    }

    const duration = `${fromMonth} ${fromYear} - ${toMonth} ${toYear}`;

    setCvData({
      ...cvData,
      experience: cvData.experience.map((exp) =>
        exp.id === editingExpId ? { ...exp, jobTitle, company, duration, responsibilities } : exp
      ),
    });

    setEditingExpId(null);
  };

  // Save skill edit
  const saveSkillEdit = () => {
    if (!skillEditData.trim()) {
      alert('Skill cannot be empty.');
      return;
    }
    const newSkills = [...cvData.skills];
    newSkills[editingSkillId] = skillEditData.trim();
    setCvData({ ...cvData, skills: newSkills });
    setEditingSkillId(null);
  };

  return (
    <div className="cv-preview">
      <h2>Personal Information</h2>
      <p><strong>Name:</strong> {cvData.name}</p>
      <p><strong>Email:</strong> {cvData.email}</p>
      <p><strong>Phone:</strong> {cvData.phone}</p>
      <p><strong>Address:</strong> {cvData.address}</p>

      <h2>Education</h2>
      {cvData.education.length === 0 && <p>No education entries yet.</p>}
      <ul>
        {cvData.education.map((edu) => (
          <li key={edu.id} style={{ marginBottom: '10px' }}>
            {editingEduId === edu.id ? (
              <>
                <input
                  type="text"
                  name="degree"
                  value={eduEditData.degree}
                  onChange={handleEduEditChange}
                  placeholder="Degree"
                />
                <input
                  type="text"
                  name="institution"
                  value={eduEditData.institution}
                  onChange={handleEduEditChange}
                  placeholder="Institution"
                />
                <input
                  type="text"
                  name="gradYear"
                  value={eduEditData.gradYear}
                  onChange={handleEduEditChange}
                  placeholder="Graduation Year"
                />
                <button onClick={saveEduEdit}>Save</button>
                <button onClick={() => setEditingEduId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p><strong>Degree:</strong> {edu.degree}</p>
                <p><strong>Institution:</strong> {edu.institution}</p>
                <p><strong>Graduation Year:</strong> {edu.gradYear}</p>
                <button onClick={() => startEditEducation(edu)}>Edit</button>
                <button onClick={() => deleteEducation(edu.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2>Experience</h2>
      {cvData.experience.length === 0 && <p>No experience entries yet.</p>}
      <ul>
        {cvData.experience.map((exp) => (
          <li key={exp.id} style={{ marginBottom: '10px' }}>
            {editingExpId === exp.id ? (
              <>
                <input
                  type="text"
                  name="jobTitle"
                  value={expEditData.jobTitle}
                  onChange={handleExpEditChange}
                  placeholder="Job Title"
                />
                <input
                  type="text"
                  name="company"
                  value={expEditData.company}
                  onChange={handleExpEditChange}
                  placeholder="Company"
                />
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  name="fromMonth"
                  value={expEditData.fromMonth}
                  onChange={handleExpEditChange}
                  placeholder="From Month (e.g., Jan)"
                />
                <input
                  type="text"
                  name="fromYear"
                  value={expEditData.fromYear}
                  onChange={handleExpEditChange}
                  placeholder="From Year (e.g., 2020)"
                />
                <input
                  type="text"
                  name="toMonth"
                  value={expEditData.toMonth}
                  onChange={handleExpEditChange}
                  placeholder="To Month (e.g., Dec)"
                />
                <input
                  type="text"
                  name="toYear"
                  value={expEditData.toYear}
                  onChange={handleExpEditChange}
                  placeholder="To Year (e.g., 2021)"
                />
              </div>
                <textarea
                  name="responsibilities"
                  value={expEditData.responsibilities}
                  onChange={handleExpEditChange}
                  placeholder="Responsibilities"
                />
                <button onClick={saveExpEdit}>Save</button>
                <button onClick={() => setEditingExpId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p><strong>Job Title:</strong> {exp.jobTitle}</p>
                <p><strong>Company:</strong> {exp.company}</p>
                <p><strong>Duration:</strong> {exp.duration}</p>
                <p><strong>Responsibilities:</strong> {exp.responsibilities}</p>
                <button onClick={() => startEditExperience(exp)}>Edit</button>
                <button onClick={() => deleteExperience(exp.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2>Skills</h2>
      {cvData.skills.length === 0 && <p>No skills added yet.</p>}
      <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
        {cvData.skills.map((skill, id) => (
          <li key={id} style={{ marginBottom: '8px' }}>
            {editingSkillId === id ? (
              <>
                <input
                  type="text"
                  value={skillEditData}
                  onChange={handleSkillEditChange}
                />
                <button onClick={saveSkillEdit} style={{ marginLeft: '5px' }}>
                  Save
                </button>
                <button onClick={() => setEditingSkillId(null)} style={{ marginLeft: '5px' }}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{skill}</span>
                <button onClick={() => startEditSkill(id)} style={{ marginLeft: '10px' }}>
                  Edit
                </button>
                <button onClick={() => deleteSkill(id)} style={{ marginLeft: '5px' }}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CVPreview;
