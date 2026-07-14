import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="hf-footer py-4 mt-auto">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <div className="d-flex align-items-center gap-2 text-white">
          <Logo size={22} />
          <span className="fw-bold">HomeFixr</span>
        </div>
        <div className="small">&copy; {new Date().getFullYear()} HomeFixr. Built on a Service-Oriented Architecture.</div>
        <div className="d-flex gap-3">
          <a href="#" className="small">Privacy</a>
          <a href="#" className="small">Terms</a>
          <a href="#" className="small">Contact</a>
        </div>
      </div>
    </footer>
  );
}
