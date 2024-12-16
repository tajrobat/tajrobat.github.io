"use client";

import { Share2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const shareData = {
    title,
    text,
    url,
  };

  const handleShare = async (platform?: string) => {
    try {
      if (platform) {
        let shareUrl = "";
        switch (platform) {
          case "twitter":
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              text
            )}&url=${encodeURIComponent(url)}`;
            break;
          case "telegram":
            shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
              url
            )}&text=${encodeURIComponent(text)}`;
            break;
          case "linkedin":
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              url
            )}`;
            break;
        }
        window.open(shareUrl, "_blank");
      } else if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: "لینک کپی شد",
          description: "می‌توانید آن را به اشتراک بگذارید",
        });
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
          <span className="sr-only">اشتراک‌ گذاری</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleShare("twitter")}>
          توییتر
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("telegram")}>
          تلگرام
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("linkedin")}>
          لینکدین
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare()}>
          کپی لینک
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
