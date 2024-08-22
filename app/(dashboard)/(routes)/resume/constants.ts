import * as z from "zod";

export const formSchema = z.object({
  personalInfo: z.object({
    name: z.string().nonempty("Name is required."),
    title: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    location: z.string().optional(),
    file: z.any().optional(),
  }),
  socialMedia: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    website: z.string().optional(),
  }),
  summary: z.string().max(200, "Summary must be at most 200 characters.").optional(),
  education: z.array(z.object({
    degree: z.string().optional(),
    institution: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })).optional(),
  workExperience: z.array(z.object({
    company: z.string().optional(),
    position: z.string().optional(),
    companySummary: z.string().optional(), // updated field name
    accomplishments: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })).optional(),
  projects: z.array(z.object({
    name: z.string().optional(),
    description: z.string().optional(),
  })).optional( 
    
  ),
  technicalSkills: z.array(z.string().optional()).optional(),
  softSkills: z.array(z.string().optional()).optional(),
  additionalSkills: z.array(z.string().optional()).optional(),
  languages: z.array(z.string().optional()).optional(),
  certifications: z.array(z.object({
    name: z.string().optional(),
    institution: z.string().optional(),
  })).optional(),
});
