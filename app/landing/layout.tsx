import { WebsiteShell } from "./website-components";
import type { ReactNode } from "react";

export default function LandingWebsiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <WebsiteShell>{children}</WebsiteShell>;
}
