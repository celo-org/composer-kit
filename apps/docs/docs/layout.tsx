import { ComposerKitProvider } from "@composer-kit/ui/core";
import "./styles.css";

export default function Layout({ children }: any) {
  return <ComposerKitProvider>{children}</ComposerKitProvider>;
}
