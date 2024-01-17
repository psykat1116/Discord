"use client";
import { useEffect, useState } from "react";
import CreateServer from "../modals/CreateServer";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServer />
    </>
  );
};
