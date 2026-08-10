import { Brand } from "./Brand";

export function Footer() {
  return (
    <footer>
      <div className="shell">
        <a className="brand" href="#top">
          <Brand />
        </a>
        <p>Evidence infrastructure for AI-native product decisions.</p>
        <p>© 2026 VerityLoop</p>
      </div>
    </footer>
  );
}
