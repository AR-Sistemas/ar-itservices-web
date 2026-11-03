import { createFileRoute, notFound } from "@tanstack/react-router";
import { SolutionsPage } from "@/components/site/SolutionsPage";
import { getContent } from "@/i18n/content";
import { z } from "zod";

export const Route = createFileRoute("/soluciones_/$productId")({
  validateSearch: z.object({ origen: z.literal("qr").optional().catch(undefined) }),
  loader: ({ params }) => {
    const product = getContent("ES").solutions.products.find((p) => p.id === params.productId);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const title = `${loaderData.name} | Soluciones | AR IT Services`;
    const url = `https://ar-itservices.com/soluciones/${loaderData.id}`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.short },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.short },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();
  const { origen } = Route.useSearch();
  return <SolutionsPage productId={product.id} fromQr={origen === "qr"} />;
}
