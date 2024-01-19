import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ src, className }) => {
  return (
    <Avatar className="flex justify-center items-center">
      <AvatarImage
        src={src}
        className={cn("h-7 w-7 md:h-10 md:w-10", className)}
      />
    </Avatar>
  );
};

export default UserAvatar;
