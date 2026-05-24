import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import EmptyRoutePage from "@/components/tools/empty-route-page";

export const metadata: Metadata = createPageMetadata({
  title: "Chats",
  description: "Chats page placeholder for Hermes/AI.",
  keywords: ["chats", "placeholder"],
});

const ChatsPage = () => {
  return <EmptyRoutePage />;
};

export default ChatsPage;
