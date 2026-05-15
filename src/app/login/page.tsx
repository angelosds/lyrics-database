import { signIn, auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session) redirect("/admin");

  const { error } = await searchParams;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-elev)" }}>
      <div style={{ padding: "32px 40px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a className="wordmark" href="/">ibero</a>
        <Link
          href="/"
          style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--fg-muted)", fontSize: 13, textDecoration: "none" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5m6-7-7 7 7 7"/>
          </svg>
          Voltar ao site
        </Link>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div className="card" style={{ width: "100%", maxWidth: 380, padding: 36, background: "var(--bg)" }}>
          <div className="micro" style={{ marginBottom: 10 }}>Acesso restrito</div>
          <h1 className="title" style={{ marginBottom: 4 }}>Área Admin</h1>
          <p className="small" style={{ marginBottom: 24 }}>Faça login para gerenciar músicas e setlists.</p>

          {error && (
            <div className="alert" style={{ marginBottom: 18 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 1, flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
              </svg>
              <span>E-mail ou senha incorretos. Tente novamente.</span>
            </div>
          )}

          <form
            action={async (formData) => {
              "use server";
              try {
                await signIn("credentials", {
                  email: formData.get("email"),
                  password: formData.get("password"),
                  redirectTo: "/admin",
                });
              } catch (err) {
                if (err instanceof AuthError) {
                  redirect("/login?error=credentials");
                }
                throw err;
              }
            }}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <div className="field">
              <label>E-mail</label>
              <input className="input" type="email" name="email" required autoComplete="email" placeholder="seu@email.com" />
            </div>
            <div className="field">
              <label>Senha</label>
              <input className="input" type="password" name="password" required autoComplete="current-password" placeholder="••••••••" />
            </div>
            <button className="btn btn-primary btn-lg" type="submit" style={{ marginTop: 4, justifyContent: "center" }}>
              Entrar
            </button>
          </form>

          <div className="small" style={{ marginTop: 18, color: "var(--fg-faint)", textAlign: "center" }}>
            Esqueceu a senha? Fale com um administrador.
          </div>
        </div>
      </div>
    </div>
  );
}
