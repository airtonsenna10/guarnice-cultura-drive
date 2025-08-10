import TopNav from "@/components/layout/TopNav";
import { useEffect, useMemo, useState } from "react";
import { listAll } from "@/services/localdb";
import { Veiculo, SolicitacaoVeiculo } from "@/services/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

export default function Dashboard() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoVeiculo[]>([]);

  useEffect(() => {
    setVeiculos(listAll<Veiculo>("veiculos"));
    setSolicitacoes(listAll<SolicitacaoVeiculo>("solicitacoes"));
  }, []);

  const stats = useMemo(() => ({
    total: veiculos.length,
    disponiveis: veiculos.filter(v => v.status === "disponivel").length,
    manutencao: veiculos.filter(v => v.status === "manutencao").length,
    reservado: veiculos.filter(v => v.status === "reservado").length,
  }), [veiculos]);

  const chartData = useMemo(() => {
    const groups = { pendente: 0, aprovada: 0, rejeitada: 0 } as Record<string, number>;
    solicitacoes.forEach(s => { groups[s.status] = (groups[s.status] || 0) + 1; });
    return Object.entries(groups).map(([k, v]) => ({ status: k, total: v }));
  }, [solicitacoes]);

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="container mx-auto py-6">
        <section className="rounded-xl p-6 bg-brand-gradient text-primary-foreground shadow-elevated">
          <h1 className="text-2xl font-semibold">Bem-vindo ao Guarnicé Frotas</h1>
          <p className="opacity-90">Cultura + funcionalidade na gestão da frota escolar.</p>
        </section>

        <section className="grid md:grid-cols-4 gap-4 mt-6">
          <Card><CardHeader><CardTitle>Veículos</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">{stats.total}</CardContent></Card>
          <Card><CardHeader><CardTitle>Disponíveis</CardTitle></CardHeader><CardContent className="text-3xl font-semibold text-secondary">{stats.disponiveis}</CardContent></Card>
          <Card><CardHeader><CardTitle>Em Manutenção</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">{stats.manutencao}</CardContent></Card>
          <Card><CardHeader><CardTitle>Reservados</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">{stats.reservado}</CardContent></Card>
        </section>

        <section className="mt-8">
          <Card>
            <CardHeader><CardTitle>Solicitações por Status</CardTitle></CardHeader>
            <CardContent style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis allowDecimals={false} />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
