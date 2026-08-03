export interface AboutContent {
  photo: string;
  oneLiner: string;
  bio: string;
}

export interface ExperienceEntry {
  role: string;
  org: string;
  start: string;
  end: string | null;
}

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
  category: "engineering" | "research";
  period: { start: string; end: string | null };
  role: string[];
  stack: string[];
  links: { live?: string; github?: string };
  order: number;
}
