import { SignedIn, SignedOut } from "@clerk/nextjs";
import Dashboard from "@/components/Dashboard";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  return (
    <div className="min-h-screen">
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <SignedIn>
        <Dashboard />
      </SignedIn>
    </div>
  );
}
