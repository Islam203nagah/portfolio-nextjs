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

export type EducationItem = {
  degree: string;
  institution: string;
  year: string;
  gpa: string;
  project: string;
};

export type TrainingItem = {
  company: string;
  date: string;
  description: string;
};

export type AchievementItem = {
  title: string;
  description: string;
};

export type LanguageItem = {
  name: string;
  level: string;
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
  education: EducationItem[];
  trainings: TrainingItem[];
  achievements: AchievementItem[];
  languages: LanguageItem[];
  maritalStatus?: string;
  dateOfBirth?: string;
  nationality?: string;
  militaryStatus?: string;
};
