"use client";
import { useEffect, useState } from "react";
import CreateServer from "../modals/CreateServer";
import InviteModal from "../modals/InviteModal";
import EditServer from "../modals/EditServer";

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
    </>
  );
};
