import { ModeToggle } from "@/components/ToggleTheme";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col">
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </div>
  );
};

export default Home;
