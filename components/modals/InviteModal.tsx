"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useModal from "@/hooks/useModal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import useOrigin from "@/hooks/useOrigin";
import axios from "axios";
import Image from "next/image";

const InviteModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "invite";
  const origin = useOrigin();
  const { server } = data;
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onNew = async () => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `/api/server/${server?.id}/invite-code`
      );
      onOpen("invite", { server: response.data });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#1e1f22] text-black dark:text-white p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-left font-bold">
            <Image
              src="/logo.png"
              alt="logo"
              width={50}
              height={50}
              className="object-cover mb-2"
            />
            Invite Friends To{" "}
            <span className="text-indigo-500">{server?.name}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-800 dark:text-zinc-400">
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={loading}
              readOnly
              className="bg-zinc-300/50 dark:bg-zinc-900 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button disabled={loading} onClick={copyToClipboard} size="icon">
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            onClick={onNew}
            disabled={loading}
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4"
          >
            Generate a new Link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
