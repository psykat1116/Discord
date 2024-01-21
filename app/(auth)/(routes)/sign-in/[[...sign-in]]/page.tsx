import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-full w-full bg-[url('/Background.png')] bg-cover bg-center bg-no-repeat z-1 flex justify-center items-center">
      <SignIn />
    </div>
  );
}
