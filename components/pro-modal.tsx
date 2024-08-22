"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  FileText,
  Pencil,
  Check,
  Zap,
  DollarSign,
  Smile
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useProModal } from "@/hooks/use-pro-modal";
import { cn } from "@/lib/utils";

const tools = [
  {
    name: "Interview Assistant",
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/interview"
  },
  {
    name: "Resume Generation",
    icon: FileText,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/resume"
  },
  {
    name: "Cover Letter Generation",
    icon: Pencil,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
    href: "/cover"
  },
];

export default function ProModal() {
  const proModal = useProModal();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubscribe = () => {
    try {
      setLoading(true);
      // Redirect user to settings page with query parameter
      window.location.href = "/settings?fromProModal=true";
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold text-xl py-1">
              Get Pro For Unlimited Access
              <Badge variant="premium" className="uppercase text-sm py-1">
                PRO
              </Badge>
            </div>
            <div className="flex items-center gap-x-2 font-bold text-xl py-1">
              For Only 20$/month
            </div>
          </DialogTitle>
          <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
            {tools.map((tool) => (
              <Card
                key={tool.name}
                className="p-3 border-black/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-x-4">
                  <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                    <tool.icon className={cn("w-6 h-6", tool.color)} />
                  </div>
                  <div className="font-semibold text-sm">{tool.name}</div>
                </div>
                <Check className="text-primary w-5 h-5" />
              </Card>
            ))}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={onSubscribe}
            size="lg"
            variant="premium"
            className="w-full"
            disabled={loading}
          >
            Start Today
            <Smile className="w-4 h-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
