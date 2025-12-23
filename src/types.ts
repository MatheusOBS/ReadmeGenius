export interface FormData {
  projectName: string;
  tagline: string;
  description: string;
  techStack: string;
  features: string;
  installation: string;
  usage: string;
  license: string;
  tone: "professional" | "creative" | "minimalist" | "academic";
  template: "standard" | "minimal" | "enterprise" | "hacker";
  language: string;
  logoUrl?: string;
  socialLinks?: string;
}
