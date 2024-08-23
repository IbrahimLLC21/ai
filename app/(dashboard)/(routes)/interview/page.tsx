"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Mic } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import Heading from "@/components/heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

import { cn } from "@/lib/utils";
import { useProModal } from "@/hooks/use-pro-modal";

import { formSchema } from "./constants";
import UserDetailsModal from "@/components/user-details-modal";

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ar', label: 'Arabic' },
  { code: 'nl', label: 'Dutch' },
  { code: 'vi', label: 'Vietnamese' },
  { code: 'hu', label: 'Hungarian' },
  { code: 'bs', label: 'Bosnian' },
  { code: 'es', label: 'Spanish' },
];

import { ChatCompletionRequestMessage as OpenAIChatCompletionRequestMessage } from "openai"; // Import the base type

interface CustomChatCompletionRequestMessage extends OpenAIChatCompletionRequestMessage {
  name?: string;
  position?: string;
  company?: string;
}

const ConversationPage = () => {
  const { t } = useTranslation();
  const proModal = useProModal();
  const router = useRouter();
  const [messages, setMessages] = useState<CustomChatCompletionRequestMessage[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [selectedLang, setSelectedLang] = useState("en");
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<any>(null);
  const shouldRestartRef = useRef(false);
  const hasShownWarningRef = useRef(false);
  const isRecognitionRunningRef = useRef(false);

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [userDetails, setUserDetails] = useState({ name: "", position: "", company: "" });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLang;

      recognition.onresult = (event: { resultIndex: any; results: string | any[]; }) => {
        let interimTranscription = "";
        let finalTranscription = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscription += transcript + " ";
          } else {
            interimTranscription += transcript;
          }
        }
        setTranscribedText((prev) => prev + finalTranscription);
        setInterimText(interimTranscription);
      };

      recognition.onend = () => {
        isRecognitionRunningRef.current = false;
        if (shouldRestartRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            if (shouldRestartRef.current) {
              recognition.start();
              isRecognitionRunningRef.current = true;
            }
          }, 100);
        }
      };

      recognitionRef.current = recognition;
    } else {
      toast.error(t("speechRecognitionNotSupported"));
    }
  }, [selectedLang, t]);

  useEffect(() => {
    form.setValue("prompt", transcribedText + interimText);
  }, [transcribedText, interimText, form]);

  const startTranscription = () => {
    if (!hasShownWarningRef.current) {
      alert(t("noHeadphonesWarning"));
      hasShownWarningRef.current = true;
    }

    if (recognitionRef.current && !isRecognitionRunningRef.current) {
      shouldRestartRef.current = true;
      recognitionRef.current.start();
      isRecognitionRunningRef.current = true;
      setIsTranscribing(true);
    }
  };

  const stopTranscription = () => {
    if (recognitionRef.current) {
      shouldRestartRef.current = false;
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      isRecognitionRunningRef.current = false;
      setIsTranscribing(false);
      clearTimeout(timeoutRef.current);
      setTranscribedText("");
      setInterimText("");
    }
  };

  const handleModalSubmit = (details: { name: string; position: string; company: string; }) => {
    setUserDetails(details);
    setIsModalOpen(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!userDetails.name || !userDetails.position || !userDetails.company) {
      setIsModalOpen(true);
      return;
    }

    try {
      const userMessage: CustomChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
        name: userDetails.name,
        position: userDetails.position,
        company: userDetails.company,
      };
      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });

      setMessages((current) => [...current, userMessage, response.data]);
      setTranscribedText("");
      setInterimText("");
      form.reset();

      if (recognitionRef.current) {
        stopTranscription(); // Stop the transcription
      }
    } catch (error: any) {
      if (error?.response?.status === 403) proModal.onOpen();
      else toast.error(t("somethingWentWrong"));
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title={t("interviewAssistantTitle")}
        description={t("interviewAssistantDescription")}
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div className="my-2">
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="border rounded p-2"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-8">
                    <FormControl className="m-0 p-0">
                      <Input
                        disabled={isLoading}
                        placeholder={t("promptPlaceholder")}
                        className="pl-2 border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                disabled={isLoading}
                className="col-span-6 lg:col-span-2 w-full"
              >
                {t("generate")}
              </Button>
              <Button
                type="button"
                onClick={isTranscribing ? stopTranscription : startTranscription}
                disabled={isLoading}
                className="col-span-6 lg:col-span-2 w-full"
              >
                {isTranscribing ? t("stop") : <Mic className="h-5 w-5" />}
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
            <Empty label={t("noConversationLabel")} />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default ConversationPage;
