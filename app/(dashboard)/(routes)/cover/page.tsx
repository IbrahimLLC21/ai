"use client";

import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";
import ReactMarkdown from "react-markdown";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next"; // Import the hook

import Heading from "@/components/heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { BotAvatar } from "@/components/bot-avatar";

import { useProModal } from "@/hooks/use-pro-modal";

const extendedFormSchema = z.object({
  cv: z.string().nonempty("CV is required."),
  jobDescription: z.string().nonempty("Job Description is required.")
});

export default function MotivationPage() {
  const { t } = useTranslation(); // Initialize translation
  const proModal = useProModal();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const form = useForm<z.infer<typeof extendedFormSchema>>({
    resolver: zodResolver(extendedFormSchema),
    defaultValues: {
      cv: "",
      jobDescription: ""
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof extendedFormSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: `CV: ${values.cv}\nJob Description: ${values.jobDescription}`
      };
      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/image", {
        messages: newMessages
      });

      setMessages((current) => [...current, response.data]);

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) proModal.onOpen();
      else toast.error(t("somethingWentWrong")); // Translate error message
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title={t("headingTitle")} // Translation key for title
        description={t("headingDescription")} // Translation key for description
        icon={Pencil}
        iconColor="text-blue-700"
        bgColor="bg-blue-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="cv"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Textarea
                        disabled={isLoading}
                        placeholder={t("cvPlaceholder")} // Translation key for CV placeholder
                        className="pl-2 border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="jobDescription"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Textarea
                        disabled={isLoading}
                        placeholder={t("jobDescriptionPlaceholder")} // Translation key for job description placeholder
                        className="pl-2 border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                disabled={isLoading}
                className="col-span-12 lg:col-span-2 w-full"
              >
                {t("generateButtonText")} 
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label={t("noCoverLettersLabel")} /> // Translation key for empty state label
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages
              .filter((message) => message.role !== "user")
              .map((message) => (
                <div
                  key={message.content}
                  className="p-8 w-full flex items-start gap-x-8 rounded-lg bg-muted"
                >
                  <BotAvatar />
                  <ReactMarkdown
                    components={{
                      pre: ({ node, ...props }) => (
                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                          <pre {...props} />
                        </div>
                      ),
                      code: ({ node, ...props }) => (
                        <code className="bg-black/10 rounded-lg p-1" {...props} />
                      )
                    }}
                    className="text-sm overflow-hidden leading-7"
                  >
                    {message.content || ""}
                  </ReactMarkdown>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
