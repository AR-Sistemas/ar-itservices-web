import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/soluciones")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "soluciones" });
  },
});
