"use client";
import { useEffect, useState } from "react";
import CreateServer from "../modals/CreateServer";
import InviteModal from "../modals/InviteModal";
import EditServer from "../modals/EditServer";
import MemberModal from "../modals/MemberModal";
import CreateChannel from "../modals/CreateChannel";
import LeaveServer from "../modals/LeaveServer";
import DeleteServer from "../modals/DeleteServer";
import DeleteChannel from "../modals/DeleteChannel";
import EditChannel from "../modals/EditChannel";
import MessageFile from "../modals/MessageFile";

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
      <LeaveServer />
      <DeleteServer />
      <DeleteChannel />
      <EditChannel />
      <MessageFile />
    </>
  );
};
