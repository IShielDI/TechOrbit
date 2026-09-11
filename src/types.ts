export type HackathonRoleId =
  | 'marketing-outreach'
  | 'design-content'
  | 'logistics-operations'
  | 'technical-judging'
  | 'hospitality-volunteers';

export interface HackathonRole {
  id: HackathonRoleId;
  title: string;
  headcount: string;
  roleTag: string;
  color: string;
  glowColor: string;
  iconName: string;
  mission: string;
  deliverables: string[];
  slotsAvailable: number;
}

export interface MemberApplication {
  id: string;
  playerName: string;
  handle: string;
  email: string;
  personalEmail?: string;
  studentId: string;
  year: string;
  role: HackathonRoleId;
  experienceLevel: 'Novice' | 'Apprentice' | 'Adept' | 'Master';
  portfolioOrGithub?: string;
  linkedin?: string;
  motivation: string;
  submittedAt: string;
  receivedAt?: string;
}

export interface SelectedCandidate {
  id: string;
  name: string;
  semester: string; // e.g., 'Semester 6', 'Semester 4', 'Semester 8'
  branch: string; // e.g., 'Computer Science & Engineering'
  domain: HackathonRoleId;
  roleTitle: string;
  selectionBadge: string;
  avatarInitials: string;
  verifiedStatus: string;
  keySkill: string;
}
