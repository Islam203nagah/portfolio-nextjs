export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  description: string;
};

export type ProjectItem = {
  name: string;
  description: string;
  link?: string;
};

export type Profile = {
  name: string;
  title: string;
  location: string;
  email?: string;
  linkedIn?: string;
  phone?: string;
  summary?: string;
  skills?: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  photo?: string;
};
