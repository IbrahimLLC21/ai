import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';

// Define the Message interface
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  try {
    // Check user authentication
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Parse request body
    const body = await req.json();
    const { messages }: { messages: Message[] } = body;

    if (!configuration.apiKey) return new NextResponse("OpenAI API Key Not Configured", { status: 500 });
    if (!messages) return new NextResponse("Messages are required", { status: 400 });

    // Extract user details from the message content
    const userMessage = messages.find((m: Message) => m.role === 'user');
    if (!userMessage || !userMessage.content) {
      return new NextResponse("Invalid message format", { status: 400 });
    }

    const contentPrefix = 'Generate a resume with the following details: ';
    if (!userMessage.content.startsWith(contentPrefix)) {
      return new NextResponse("Invalid message content", { status: 400 });
    }

    const userDetails = JSON.parse(userMessage.content.replace(contentPrefix, ''));
    console.log("User Details: ", userDetails);  // Log extracted user details

    // Check API limits and subscription status
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) return new NextResponse("Free Trial Has Expired", { status: 403 });

    // Generate resume content with OpenAI
    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: messages,
    });

    if (!isPro) await increaseApiLimit();

    const resumeContent = response.data.choices[0].message?.content;

    // Load and process the DOCX template
    const templatePath = path.resolve('public', 'resumepdf.docx');
    const templateContent = fs.readFileSync(templatePath, 'binary');
    
    const zip = new PizZip(templateContent);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Format functions
    const formatArray = (arr: any[]) => Array.isArray(arr) ? arr.map(item => `- ${item}`).join('\n') : '';
    
    const formatEducation = (education: any[]) => {
      if (!Array.isArray(education)) return '';
      return education.map(ed => `${ed.institution}\n${ed.degree}\n${ed.startDate} - ${ed.endDate}`).join('\n\n');
    };
    
    const formatCertifications = (certifications: any[]) => {
      if (!Array.isArray(certifications)) return '';
      return certifications.map(cert => `- ${cert.name}\n${cert.institution}`).join('\n\n');
    };

    const formatWorkExperience = (workExperience: any[]) => {
      if (!Array.isArray(workExperience)) return '';
    
      return workExperience.map(exp => {
        const accomplishments = typeof exp.accomplishments === 'string' && exp.accomplishments.trim() !== ''
          ? `• ${exp.accomplishments.replace(/\n/g, '\n• ')}`
          : '';
    
        const startDate = exp.startDate || 'N/A';
        const endDate = exp.endDate || 'Present';
    
        return `
Company: ${exp.company || ''}
Position: ${exp.position || ''}
Company Summary: ${exp.companySummary || ''}
Accomplishments: ${accomplishments || ''}
Start Date: ${startDate}
End Date: ${endDate}`;
      }).join('\n\n');
    };

    // Replace placeholders with user data
    const data = {
      Name: userDetails.personalInfo?.name || '',
      Title: userDetails.personalInfo?.title || '',
      Phone: userDetails.personalInfo?.phone || '',
      Email: userDetails.personalInfo?.email || '',
      Location: userDetails.personalInfo?.location || '',
      Github: userDetails.socialMedia?.github || '',
      Linkedin: userDetails.socialMedia?.linkedin || '',
      Website: userDetails.socialMedia?.website || '',
      Summary: userDetails.summary || '',
      Education: formatEducation(userDetails.education) || '',
      TechnicalSkills: formatArray(userDetails.technicalSkills) || '',
      SoftSkills: formatArray(userDetails.softSkills) || '',
      AdditionalSkills: formatArray(userDetails.additionalSkills) || '',
      Languages: formatArray(userDetails.languages) || '',
      Certifications: formatCertifications(userDetails.certifications) || '',
      WorkExperience: formatWorkExperience(userDetails.workExperience) || ''
    };

    console.log("Data to be set in document: ", data);  // Log data to be set in the document

    doc.setData(data);

    // Render the document
    doc.render();
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    // Set headers to indicate a file attachment
    return new NextResponse(buffer, {
      headers: {
        'Content-Disposition': 'attachment; filename=generated_resume.docx',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    });
  } catch (error) {
    console.error("[RESUME_GENERATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
