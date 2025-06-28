import React, { useState, useCallback } from 'react';
import { NewProjectData } from '../types';
import { generateSummary } from '../services/geminiService';
import { SparklesIcon } from './icons';

interface ProjectFormProps {
  onSubmit: (data: NewProjectData) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateSummary = useCallback(async () => {
    if (!description) {
      setError('Please provide a detailed description first to generate a summary.');
      return;
    }
    setError('');
    setIsGenerating(true);
    try {
      const generatedSummary = await generateSummary(description);
      setSummary(generatedSummary);
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, [description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary || !description || !skills) {
      setError('Please fill out all fields.');
      return;
    }
    setError('');
    const skillsNeeded = skills.split(',').map(s => s.trim()).filter(Boolean);
    onSubmit({ title, summary, description, skillsNeeded });
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-6">Create a New Project</h2>
      {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Project Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
            placeholder="e.g., AI-Powered Study Buddy"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Detailed Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
            placeholder="Describe your project in detail. What problem does it solve? What are the key features?"
            required
          />
        </div>
        
        <div>
            <div className="flex justify-between items-center mb-1">
                <label htmlFor="summary" className="block text-sm font-medium text-slate-300">Catchy Summary</label>
                <button
                    type="button"
                    onClick={handleGenerateSummary}
                    disabled={isGenerating || !description}
                    className="flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <SparklesIcon className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
            </div>
            <input
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                placeholder="A one-sentence summary of your project."
                required
            />
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-slate-300 mb-1">Skills Needed</label>
          <input
            type="text"
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
            placeholder="e.g., React, Python, UI/UX Design"
            required
          />
          <p className="text-xs text-slate-500 mt-1">Separate skills with a comma.</p>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-6 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-6 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/20"
          >
            Submit Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;