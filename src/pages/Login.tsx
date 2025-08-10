import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { seed } from "@/services/seed";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: "", senha: "" });

  useEffect(() => {
    seed();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(form.login, form.senha);
    if (!ok) {
      toast({ title: "Falha no login", description: "Credenciais inválidas.", variant: "destructive" as any });
    } else {
      toast({ title: "Bem-vindo!", description: "Login realizado com sucesso." });
      navigate("/dashboard");
    }
  };

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      <section className="hidden md:flex items-center justify-center bg-brand-gradient">
        <div className="text-left max-w-md p-10 text-primary-foreground">
          <img src="/lovable-uploads/93e9ad14-7e94-4cab-950f-8774ac630d1d.png" alt="Logo Guarnicé Frotas" className="h-14 mb-6" />
          <h1 className="text-3xl font-semibold mb-3">Guarnicé Frotas</h1>
          <p className="text-lg opacity-90">Gestão moderna de frota escolar: solicitações, autorizações e manutenções em um só lugar.</p>
        </div>
      </section>
      <section className="flex items-center justify-center p-8">
        <form onSubmit={submit} className="w-full max-w-sm bg-card border rounded-lg p-6 shadow-elevated">
          <h1 className="text-2xl font-semibold mb-6">Acessar</h1>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Login</label>
              <Input value={form.login} onChange={(e) => setForm({ ...form, login: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Senha</label>
              <Input type="password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required />
            </div>
          </div>
          <Button variant="brand" className="w-full mt-6" type="submit">Entrar</Button>
          <p className="text-xs text-muted-foreground mt-3">Sugestão: admin / admin123 — gestor / gestor123</p>
        </form>
      </section>
    </main>
  );
}
