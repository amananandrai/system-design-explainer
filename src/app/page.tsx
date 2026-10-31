import { Suspense } from "react";
import ArchitectureExplorer from "@/components/ArchitectureExplorer";

export default function HomePage() {
  // The explorer reads its state from the URL, so it renders on the client.
  return (
    <Suspense fallback={<div className="h-screen bg-slate-950" />}>
      <ArchitectureExplorer />
    </Suspense>
  );
}
