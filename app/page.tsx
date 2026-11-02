import Workspace from "@/components/workspace/Workspace";
import { initialMessages } from "@/lib/chat";

export default async function HomePage() {
  return <Workspace initialMessages={initialMessages} />;
}
