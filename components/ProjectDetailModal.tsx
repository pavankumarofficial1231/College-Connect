import React, { useState } from 'react';
import { Project } from '../types';
import { UserGroupIcon, XMarkIcon, UserPlusIcon, CheckIcon } from './icons';

interface ProjectDetailModalProps {
  project: Project;
  currentUser: string;
  onClose: () => void;
  onJoinRequest: (projectId: string, message: string) => void;
  onManageRequest: (projectId:string, requestId: string, userName: string, action: 'accept' | 'decline') => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  currentUser,
  onClose,
  onJoinRequest,
  onManageRequest
}) => {
  const [isWritingRequest, setIsWritingRequest] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [error, setError] = useState('');

  const isOwner = project.author === currentUser;
  const isMember = project.teamMembers.includes(currentUser);
  const hasRequested = project.joinRequests?.some(req => req.userName === currentUser && req.status === 'pending');
  
  const handleSendRequest = () => {
    if (requestMessage.trim().length < 10) {
        setError('Please write a short message about why you want to join (min. 10 characters).');
        return;
    }
    setError('');
    onJoinRequest(project.id, requestMessage);
    setIsWritingRequest(false);
    setRequestMessage('');
  };

  const renderFooter = () => {
    if (isOwner) {
      return (
        <div className="bg-slate-800/50 p-4 rounded-b-2xl">
          <p className="text-center text-sm text-slate-400">You are the owner of this project.</p>
        </div>
      );
    }
    if (isMember) {
      return (
        <div className="bg-green-500/10 text-green-300 p-4 rounded-b-2xl text-center font-semibold">
          You are a member of this team.
        </div>
      );
    }
    if (hasRequested) {
      return (
        <button
          disabled
          className="w-full bg-slate-600 text-slate-400 font-bold py-3 px-4 rounded-b-2xl cursor-not-allowed"
        >
          Request Sent
        </button>
      );
    }
    return (
      <button
        onClick={() => setIsWritingRequest(true)}
        className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-b-2xl hover:bg-teal-600 transition-all duration-300 flex items-center justify-center gap-2"
      >
        <UserPlusIcon className="w-6 h-6" />
        Request to Join Team
      </button>
    );
  };

  const renderJoinRequests = () => {
    const pendingRequests = project.joinRequests?.filter(req => req.status === 'pending') || [];
    if (!isOwner || pendingRequests.length === 0) {
      return null;
    }
    return (
      <div className="mt-6">
        <h3 className="font-semibold text-lg text-teal-300 mb-3">Join Requests ({pendingRequests.length})</h3>
        <ul className="space-y-3">
          {pendingRequests.map(req => (
            <li key={req.id} className="bg-slate-700/50 p-4 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                   <UserGroupIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                   <span className="text-slate-300 font-medium">{req.userName}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button 
                    onClick={() => onManageRequest(project.id, req.id, req.userName, 'accept')}
                    className="p-2 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/40 transition-colors"
                    aria-label={`Accept ${req.userName}`}
                  >
                    <CheckIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => onManageRequest(project.id, req.id, req.userName, 'decline')}
                    className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
                    aria-label={`Decline ${req.userName}`}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-400 border-l-2 border-slate-600 pl-3 ml-2.5 italic">"{req.message}"</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 animate-scale-in">
        <div className="p-6 flex-shrink-0 flex justify-between items-start border-b border-b-slate-700">
          <h2 className="text-2xl font-bold text-teal-400 pr-4">
            {isWritingRequest ? `Request to Join: ${project.title}` : project.title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>
        
        {isWritingRequest ? (
            <div className="p-6 flex-grow flex flex-col">
              <p className="text-slate-300 mb-4">Introduce yourself to the project owner. Explain why you're a good fit and what skills you can bring to the team.</p>
              {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-sm">{error}</div>}
              <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none flex-grow"
                  placeholder="Hi, I'm interested in joining because..."
                  rows={5}
                  autoFocus
              />
              <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-slate-700">
                  <button
                      onClick={() => { setIsWritingRequest(false); setError(''); }}
                      className="py-2 px-6 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition-colors"
                  >
                      Cancel
                  </button>
                  <button
                      onClick={handleSendRequest}
                      className="py-2 px-6 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors"
                  >
                      Send Request
                  </button>
              </div>
            </div>
        ) : (
          <>
            <div className="px-6 py-6 overflow-y-auto flex-grow">
              <p className="text-slate-300 mb-4 italic">{project.summary}</p>
              <p className="text-slate-400 mb-6 whitespace-pre-wrap">{project.description}</p>
              
              <div className="mb-6">
                <h3 className="font-semibold text-lg text-teal-300 mb-2">Skills Needed</h3>
                <div className="flex flex-wrap gap-2">
                  {project.skillsNeeded.map(skill => (
                    <span key={skill} className="bg-slate-700 text-teal-300 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-teal-300 mb-2">Current Team ({project.teamMembers.length})</h3>
                 <div className="flex flex-wrap gap-3">
                  {project.teamMembers.map(member => (
                    <div key={member} className="flex items-center gap-2 bg-slate-700/80 px-3 py-1 rounded-full">
                      <UserGroupIcon className="w-5 h-5 text-teal-400" />
                      <span className="text-slate-200 font-medium">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
              {renderJoinRequests()}
            </div>
            <div className="flex-shrink-0">
              {renderFooter()}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default ProjectDetailModal;