import React from 'react';
import { Project } from '../types';
import { UserGroupIcon } from './icons';

interface ProjectCardProps {
  project: Project;
  currentUser: string;
  onSelect: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, currentUser, onSelect }) => {
  const isOwner = project.author === currentUser;

  return (
    <div 
      onClick={onSelect}
      className="bg-slate-800 rounded-2xl p-6 flex flex-col cursor-pointer group border border-slate-700 hover:border-teal-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-teal-500/10 relative"
    >
      {isOwner && (
        <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
          Owner
        </div>
      )}
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-slate-100 group-hover:text-teal-400 transition-colors duration-300 mb-2 truncate pr-12">{project.title}</h3>
        <p className="text-slate-400 text-sm mb-4 h-20 overflow-hidden text-ellipsis">
          {project.summary}
        </p>
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Skills Needed</h4>
          <div className="flex flex-wrap gap-2">
            {project.skillsNeeded.slice(0, 3).map(skill => (
              <span key={skill} className="bg-slate-700 text-teal-300 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
            ))}
            {project.skillsNeeded.length > 3 && (
              <span className="bg-slate-700 text-teal-300 text-xs font-medium px-2.5 py-1 rounded-full">
                +{project.skillsNeeded.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 pt-4 border-t border-slate-700 flex justify-between items-center">
        <div className="flex items-center text-sm text-slate-400">
          <UserGroupIcon className="w-5 h-5 mr-2 text-teal-500" />
          <span>{project.teamMembers.length} member{project.teamMembers.length !== 1 ? 's' : ''}</span>
        </div>
        <span className="text-sm text-slate-500 group-hover:text-teal-400 transition-colors duration-300">View Details &rarr;</span>
      </div>
    </div>
  );
};

export default ProjectCard;