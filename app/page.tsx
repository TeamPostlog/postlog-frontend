"use client";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function Home() {
  const handleLogin = () => {
    window.location.href = `https://api.postlog.gethiroscope.com`;
  }
  return (
    <main className="flex flex-col overflow-auto items-center justify-center p-24 h-screen w-screen">
      <div className="flex flex-col rounded-md border p-24">
      <img src="/logo.svg" className="flex flex-col w-[25vh] mb-20 mt-10"/>
      <div className=" flex flex-col items-center mb-10 font-semibold text-2xl">Login to Postlog</div>
      <Button variant="default" className=" flex flex-col mb-20" onClick={handleLogin}> Log in using Github </Button>
      </div>
      <div className=" flex flex-col items-center mt-10 mb-10 text-sm text-muted-foreground">By logging into Postlog you agree to our terms and conditions.</div>
      
    </main>
  );
}
