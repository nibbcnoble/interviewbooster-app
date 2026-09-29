export default function LoadingScreen() {
  return (
    <main className="auth-screen" aria-busy="true">
      <div className="auth-spinner" role="status">
        <span className="sr-only">Checking session…</span>
      </div>
    </main>
  );
}
