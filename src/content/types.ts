export interface AboutContent {
  photo: string;
  oneLiner: string;
  bio: string;
}

export interface ExperienceItem {
  title: string;
  description: string;
}

export type ExperienceByYear = Record<string, ExperienceItem[]>;

export interface ContactInfo {
  email: string;
  phone: string;
  instagram: string;
  blog: string;
  github: string;
}

export interface ProjectItem {
  slug: string;
  title: string;
  tagline: string;
  category: "engineering" | "research" | "experiments";
  period: { start: string; end: string | null };
  role: string[];
  stack: string[];
  links: { live?: string; github?: string };
  /** short `title` shows as a tag in the list; `by` is appended in the modal */
  awards?: { title: string; by: string }[];
  order: number;
}
