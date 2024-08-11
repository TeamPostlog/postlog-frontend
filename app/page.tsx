import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col overflow-auto items-center justify-between p-24 h-screen w-screen">
      <Button variant="default" className="mx-auto my-auto"> Log In using Github </Button>
    </main>
  );
}
