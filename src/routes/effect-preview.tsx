import { createFileRoute } from "@tanstack/react-router";
import ExpandableCardDemo from "@/components/expandable-card-demo-standard";

export const Route = createFileRoute("/effect-preview")({
  component: () => (
    <div className="min-h-screen bg-white px-4 py-20">
      <ExpandableCardDemo />
    </div>
  ),
});
