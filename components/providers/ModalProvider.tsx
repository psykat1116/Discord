"use client";
import { useEffect, useState } from "react";
import CreateServer from "../modals/CreateServer";
import InviteModal from "../modals/InviteModal";
import EditServer from "../modals/EditServer";
import MemberModal from "../modals/MemberModal";
import CreateChannel from "../modals/CreateChannel";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServer />
      <EditServer />
      <InviteModal />
      <MemberModal />
      <CreateChannel />
    </>
  );
};
