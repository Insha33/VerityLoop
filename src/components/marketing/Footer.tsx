import { Brand } from "./Brand";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <a className="brand" href="#top">
          <Brand />
        </a>
        <p className="footer-purpose"><span aria-hidden="true" />Market evidence. Product context. Human decisions.</p>
        <p>© 2026 VerityLoop</p>
      </div>
    </footer>
  );
}
