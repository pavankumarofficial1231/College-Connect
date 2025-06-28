import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Project, NewProjectData, JoinRequest } from './types';
import Header from './components/Header';
import ProjectCard from './components/ProjectCard';
import ProjectForm from './components/ProjectForm';
import ProjectDetailModal from './components/ProjectDetailModal';
import { MagnifyingGlassIcon } from './components/icons';

const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Campus Sustainability Tracker',
    summary: 'An app to monitor and promote eco-friendly practices across campus, from recycling to energy consumption.',
    description: 'We want to build a comprehensive dashboard that visualizes real-time data on campus sustainability efforts. The app will feature gamification elements to encourage student participation, such as leaderboards and rewards for green activities. We will integrate with campus APIs for data on energy usage, water consumption, and waste management.',
    skillsNeeded: ['React Native', 'Firebase', 'UI/UX Design', 'Data Visualization'],
    teamMembers: ['Alice', 'Bob'],
    author: 'Alice',
    joinRequests: [],
  },
  {
    id: 'proj-2',
    title: 'AI-Powered Study Buddy',
    summary: 'A personalized chatbot that helps students create study schedules, summarizes lecture notes, and quizzes them on key topics.',
    description: 'This project aims to leverage large language models to create an intelligent study assistant. It will be able to ingest various document types (PDFs, DOCX), generate concise summaries, create flashcards, and hold conversational-style quizzes. The goal is to make studying more efficient and interactive.',
    skillsNeeded: ['Python', 'LangChain', 'React', 'NLP'],
    teamMembers: ['Charlie'],
    author: 'Charlie',
    joinRequests: [
      { id: 'req-1', userName: 'Dave', message: 'I have experience with Python and NLP and would love to contribute to this AI project.', status: 'pending' }
    ],
  },
  {
    id: 'proj-3',
    title: 'AR Campus Tour Guide',
    summary: 'An augmented reality mobile app that provides an interactive and historical tour of the university campus.',
    description: 'New students and visitors can use their smartphone to see historical photos overlaid on current buildings, get information about landmarks, and navigate campus with AR wayfinding. The app will be built using ARKit/ARCore and will feature 3D models and rich multimedia content.',
    skillsNeeded: ['Unity', 'C#', 'ARKit', '3D Modeling'],
    teamMembers: ['Diana', 'Eve', 'Frank'],
    author: 'Diana',
    joinRequests: [],
  },
  {
    id: 'proj-4',
    title: 'Student Event Finder',
    summary: 'A centralized platform for discovering and sharing events happening on and around campus, from club meetings to concerts.',
    description: 'This web app will feature a filterable calendar, event submission forms for student organizations, and an integrated map view. The goal is to combat "event fragmentation" where events are scattered across social media, flyers, and different department websites.',
    skillsNeeded: ['Vue.js', 'Node.js', 'MongoDB', 'Leaflet.js'],
    teamMembers: ['George', 'Heidi'],
    author: 'George',
    joinRequests: [],
  },
  {
    id: 'proj-5',
    title: 'Peer Tutor Marketplace',
    summary: 'A platform connecting students who need academic help with qualified peer tutors for various subjects.',
    description: 'Tutors can create profiles listing their expertise and availability. Students can search for tutors, book sessions, and handle payments securely through the platform. It will include a rating and review system to ensure quality.',
    skillsNeeded: ['Django', 'PostgreSQL', 'Stripe API', 'React'],
    teamMembers: ['Ivan', 'Judy'],
    author: 'Ivan',
    joinRequests: [],
  },
  {
    id: 'proj-6',
    title: 'Dorm Room Recipe Share',
    summary: 'A mobile-first web app for students to share and discover simple, budget-friendly recipes that can be made in a dorm kitchen.',
    description: 'Users can post recipes with photos, tag them with dietary restrictions (e.g., vegan, gluten-free), and create shopping lists. A key feature will be a "pantry search" where users can input ingredients they have on hand to find matching recipes.',
    skillsNeeded: ['Next.js', 'GraphQL', 'Tailwind CSS', 'Cloudinary'],
    teamMembers: ['Jane Doe'],
    author: 'Jane Doe', // This user is the owner
    joinRequests: [
      { id: 'req-2', userName: 'Oscar', message: 'Big fan of cooking and I have some ideas for the pantry search feature!', status: 'pending' },
      { id: 'req-3', userName: 'Peggy', message: 'I can help with the frontend using Next.js and Tailwind CSS.', status: 'pending' },
    ],
  },
];

const ALL_USERS = [...new Set(initialProjects.flatMap(p => [p.author, ...p.teamMembers, ...(p.joinRequests?.map(r => r.userName) || [])]))];

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState('Jane Doe');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationFilterActive, setNotificationFilterActive] = useState(false);

  useEffect(() => {
    setProjects(initialProjects);
  }, []);

  const handleCreateProject = useCallback((projectData: NewProjectData) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      ...projectData,
      author: currentUser,
      teamMembers: [currentUser],
      joinRequests: [],
    };
    setProjects(prevProjects => [newProject, ...prevProjects]);
    setIsCreatingProject(false);
  }, [currentUser]);

  const handleJoinRequest = useCallback((projectId: string, message: string) => {
    const newRequest: JoinRequest = {
      id: `req-${Date.now()}`,
      userName: currentUser,
      message,
      status: 'pending',
    };

    const updateProjects = (projs: Project[]) =>
      projs.map(p =>
        p.id === projectId
          ? { ...p, joinRequests: [...(p.joinRequests || []), newRequest] }
          : p
      );

    setProjects(updateProjects);
    setSelectedProject(prev => prev ? updateProjects([prev])[0] : null);
  }, [currentUser]);

  const handleManageRequest = useCallback((projectId: string, requestId: string, userName: string, action: 'accept' | 'decline') => {
    const updateProjects = (projs: Project[]) =>
      projs.map(p => {
        if (p.id === projectId) {
          const updatedRequests = (p.joinRequests || []).filter(req => req.id !== requestId);
          const updatedMembers = action === 'accept' ? [...p.teamMembers, userName] : p.teamMembers;
          return { ...p, joinRequests: updatedRequests, teamMembers: updatedMembers };
        }
        return p;
      });
      
    setProjects(updateProjects);
    setSelectedProject(prev => prev ? updateProjects([prev])[0] : null);
  }, []);

  const filteredProjects = useMemo(() => {
    let projectsToDisplay = projects;

    if (notificationFilterActive) {
      projectsToDisplay = projects.filter(p =>
        p.author === currentUser && (p.joinRequests?.length || 0) > 0
      );
    }
    
    if (searchQuery) {
        projectsToDisplay = projectsToDisplay.filter(p =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.summary.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    return projectsToDisplay;
  }, [projects, searchQuery, notificationFilterActive, currentUser]);

  const notificationCount = useMemo(() =>
    projects.reduce((count, p) =>
      p.author === currentUser ? count + (p.joinRequests?.filter(req => req.status === 'pending').length || 0) : count, 0)
  , [projects, currentUser]);

  const renderProjectGrid = () => (
    <>
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors"
            aria-label="Search for projects"
          />
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
        </div>
      </div>
      {notificationFilterActive && (
        <div className="text-center mb-6 bg-teal-900/50 border border-teal-700 text-teal-300 p-3 rounded-lg max-w-2xl mx-auto">
          <p>Showing projects you own with pending requests. Click the bell again to clear.</p>
        </div>
      )}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} currentUser={currentUser} onSelect={() => setSelectedProject(project)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
            <h3 className="text-2xl font-semibold">No Projects Found</h3>
            <p className="mt-2">Try adjusting your search or filter.</p>
        </div>
      )}
    </>
  );
  
  return (
    <div className="min-h-screen text-white">
      <Header 
        onPostProject={() => setIsCreatingProject(true)} 
        notificationCount={notificationCount}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        allUsers={ALL_USERS}
        isFilterActive={notificationFilterActive}
        onToggleNotificationFilter={() => {
          setNotificationFilterActive(prev => !prev);
          setSearchQuery(''); // Clear search when toggling filter
        }}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isCreatingProject ? (
          <ProjectForm
            onSubmit={handleCreateProject}
            onCancel={() => setIsCreatingProject(false)}
          />
        ) : (
          renderProjectGrid()
        )}
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            currentUser={currentUser}
            onClose={() => setSelectedProject(null)}
            onJoinRequest={handleJoinRequest}
            onManageRequest={handleManageRequest}
          />
        )}
      </main>
    </div>
  );
};

export default App;