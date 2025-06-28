export interface JoinRequest {
  id: string;
  userName: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  skillsNeeded: string[];
  teamMembers: string[];
  author: string;
  joinRequests?: JoinRequest[];
}

export type NewProjectData = Omit<Project, 'id' | 'author' | 'teamMembers' | 'joinRequests'>;