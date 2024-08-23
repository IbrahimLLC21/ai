"use client";

import React, { useState } from "react";
import { FileText } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Heading from "@/components/heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import { Textarea } from "@/components/ui/textarea";
import { useProModal } from "@/hooks/use-pro-modal";
import { useTranslation } from 'react-i18next';

import { formSchema } from "./constants";

import "./transitions.css"; // Ensure this file has the necessary CSS for transitions

export default function ResumePage() {
  const { t } = useTranslation();
  const proModal = useProModal();
  const router = useRouter();
  const [docxUrl, setDocxUrl] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(
      formSchema.extend({
        summary: z.string().max(200, t('summaryPlaceholder')),
        workExperience: z.array(
          z.object({
            company: z.string(),
            position: z.string(),
            companySummary: z.string(),
            accomplishments: z.string(),
            startDate: z.string(),
            endDate: z.string(),
          })
        ),
      })
    ),
    defaultValues: {
      personalInfo: {
        name: "",
        title: "",
        phone: "",
        email: "",
        location: "",
      },
      socialMedia: {
        github: "",
        linkedin: "",
        website: "",
      },
      summary: "",
      education: [{ degree: "", institution: "", startDate: "", endDate: "" }],
      workExperience: [
        { company: "", position: "", companySummary: "", accomplishments: "", startDate: "", endDate: "" },
      ],
      projects: [{ name: "", description: "" }],
      technicalSkills: [""],
      softSkills: [""],
      additionalSkills: [""],
      languages: [""],
      certifications: [{ name: "", institution: "" }],
    },
  });

  const { fields: educationFields, append: appendEducation } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const { fields: workFields, append: appendWork } = useFieldArray({
    control: form.control,
    name: "workExperience",
  });

  const { fields: projectFields, append: appendProject } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  const { fields: technicalSkillFields, append: appendTechnicalSkill } = useFieldArray({
    control: form.control,
    name: "technicalSkills"
  });

  const { fields: softSkillsFields, append: appendSoftSkill } = useFieldArray({
    control: form.control,
    name: "softSkills",
  });

  const { fields: additionalSkillFields, append: appendAdditionalSkill } = useFieldArray({
    control: form.control,
    name: "additionalSkills",
  });

  const { fields: languageFields, append: appendLanguage } = useFieldArray({
    control: form.control,
    name: "languages",
  });

  const { fields: certificationsFields, append: appendCertification } = useFieldArray({
    control: form.control,
    name: "certifications",
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form values:", values);

    const messages = [
      {
        role: "system",
        content: "You are a resume generation assistant.",
      },
      {
        role: "user",
        content: `Generate a resume with the following details: ${JSON.stringify(values)}`,
      },
    ];

    try {
      console.log("Submitting payload:", { messages });

      const response = await axios.post("/api/resume", { messages }, { responseType: 'blob' });

      console.log("Response data:", response.data);

      const docxBlob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = URL.createObjectURL(docxBlob);
      setDocxUrl(url);

      form.reset();
    } catch (error: any) {
      console.error("Submission error:", error);
      if (error?.response?.status === 403) proModal.onOpen();
      else toast.error(t('errorMessage', { message: error.response?.data?.message || "Something went wrong." }));
    } finally {
      router.refresh();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <h3 className="text-lg font-bold">{t('personalInfo.title')}</h3>
            <FormField
              name="personalInfo.name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder={t('personalInfo.namePlaceholder')} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="personalInfo.title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder={t('personalInfo.titlePlaceholder')} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="personalInfo.phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder={t('personalInfo.phonePlaceholder')} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="personalInfo.email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder={t('personalInfo.emailPlaceholder')} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="personalInfo.location"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder={t('personalInfo.locationPlaceholder')} />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        );
      case 1:
        return (
          <>
            <h3 className="text-lg font-bold">{t('socialMedia.title')}</h3>
            <FormField
              name="socialMedia.github"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder={t('socialMedia.githubPlaceholder')} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="socialMedia.linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder={t('socialMedia.linkedinPlaceholder')} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="socialMedia.website"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder={t('socialMedia.websitePlaceholder')} />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-lg font-bold">{t('summary.title')}</h3>
            <FormField
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t('summary.placeholder')}
                      maxLength={200}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        if (target.value.length > 200) {
                          target.value = target.value.substring(0, 200);
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-lg font-bold">{t('education.title')}</h3>
            {educationFields.map((item, index) => (
              <div key={item.id}>
                <FormField
                  name={`education.${index}.degree`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder={t('education.degreePlaceholder')} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name={`education.${index}.institution`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder={t('education.institutionPlaceholder')} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name={`education.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder={t('education.startDatePlaceholder')} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name={`education.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder={t('education.endDatePlaceholder')} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button type="button" onClick={() => appendEducation({ degree: "", institution: "", startDate: "", endDate: "" })}>
              {t('addEducation')}
            </Button>
          </>
        );
      case 4:
        return (
          <>
            <h3 className="text-lg font-bold">{t('workExperience.title')}</h3>
            {workFields.map((item, index) => (
              <div key={item.id}>
                <FormField
                  name={`workExperience.${index}.company`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder={t('workExperience.companyPlaceholder')} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name={`workExperience.${index}.position`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder={t('workExperience.positionPlaceholder')} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name={`workExperience.${index}.companySummary`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea {...field} placeholder={t('workExperience.companySummaryPlaceholder')} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name={`workExperience.${index}.accomplishments`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea {...field} placeholder={t('workExperience.accomplishmentsPlaceholder')} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name={`workExperience.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder={t('workExperience.startDatePlaceholder')} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name={`workExperience.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder={t('workExperience.endDatePlaceholder')} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button type="button" onClick={() => appendWork({ company: "", position: "", companySummary: "", accomplishments: "", startDate: "", endDate: "" })}>
              {t('addWorkExperience')}
            </Button>
          </>
        );
      case 5:
        return (
          <>
            <h3 className="text-lg font-bold">{t('projects.title')}</h3>
            {projectFields.map((item, index) => (
              <div key={item.id}>
                <FormField
                  name={`projects.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder={t('projects.namePlaceholder')} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name={`projects.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea {...field} placeholder={t('projects.descriptionPlaceholder')} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button type="button" onClick={() => appendProject({ name: "", description: "" })}>
              {t('addProject')}
            </Button>
          </>
        );
      case 6:
        return (
          <>
            <h3 className="text-lg font-bold">{t('technicalSkills.title')}</h3>
            {technicalSkillFields.map((item, index) => (
              <div key={item.id}>
                <FormField
                  name={`technicalSkills.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder={t('technicalSkillPlaceholder')} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button type="button" onClick={() => appendTechnicalSkill("")}>
              {t('addTechnicalSkill')}
            </Button>
          </>
        );
      case 7:
        return (
          <>
            <h3 className="text-lg font-bold">{t('softSkills.title')}</h3>
            {softSkillsFields.map((item, index) => (
              <div key={item.id}>
                <FormField
                  name={`softSkills.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder={t('softSkillPlaceholder')} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button type="button" onClick={() => appendSoftSkill("")}>
              {t('addSoftSkill')}
            </Button>
          </>
        );
      case 8:
        return (
          <>
            <h3 className="text-lg font-bold">{t('additionalSkills.title')}</h3>
            {additionalSkillFields.map((item, index) => (
              <div key={item.id}>
                <FormField
                  name={`additionalSkills.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder={t('additionalSkillPlaceholder')} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button type="button" onClick={() => appendAdditionalSkill("")}>
              {t('addAdditionalSkill')}
            </Button>
          </>
        );
      case 9:
        return (
          <>
            <h3 className="text-lg font-bold">{t('languages.title')}</h3>
            {languageFields.map((item, index) => (
              <div key={item.id}>
                <FormField
                  name={`languages.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder={t('languagePlaceholder')} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button type="button" onClick={() => appendLanguage("")}>
              {t('addLanguage')}
            </Button>
          </>
        );
      case 10:
        return (
          <>
            <h3 className="text-lg font-bold">{t('certifications.title')}</h3>
            {certificationsFields.map((item, index) => (
              <div key={item.id}>
                <FormField
                  name={`certifications.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder={t('certifications.namePlaceholder')} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name={`certifications.${index}.institution`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder={t('certifications.institutionPlaceholder')} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button type="button" onClick={() => appendCertification({ name: "", institution: "" })}>
              {t('addCertification')}
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Heading
        title={t('resume_generator')}
        description={t('resumeDescription')}
        icon={FileText}
        iconColor="text-blue-700"
        bgColor="bg-blue-700/10"
      />
      <div className="space-y-4 px-4 lg:px-8">
        <div className="bg-white p-8 rounded-lg border w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TransitionGroup>
                <CSSTransition key={currentStep} classNames="fade" timeout={300}>
                  {renderStepContent()}
                </CSSTransition>
              </TransitionGroup>
              <div className="flex justify-between">
                <Button type="button" onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))} disabled={currentStep === 0}>
                  {t('Previous')}
                </Button>
                <Button type="button" onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 10))} disabled={currentStep === 10}>
                  {t('nextButton')}
                </Button>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader /> : t('generateResume')}
              </Button>
            </form>
          </Form>
          {docxUrl && (
            <div className="mt-4">
              <a href={docxUrl} download="resume.docx">
                {t('downloadResume')}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
