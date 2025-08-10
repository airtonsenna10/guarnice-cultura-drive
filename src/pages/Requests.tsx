import TopNav from "@/components/layout/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { listAll, addItem } from "@/services/localdb";
import { SolicitacaoVeiculo, Veiculo } from "@/services/types";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Requests() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [form, setForm] = useState({ veiculoId: "", data: "", destino: "", motivo: "", duracaoHoras: 1 });

  useEffect(() => {
    setVeiculos(listAll<Veiculo>("veiculos").filter(v => v.status === "disponivel"));
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const payload: Omit<SolicitacaoVeiculo, "id" | "createdAt" | "updatedAt"> = {
      servidor: user.nome,
      veiculoId: form.veiculoId,
      data: form.data,
      destino: form.destino,
      motivo: form.motivo,
      duracaoHoras: Number(form.duracaoHoras),
      setorResponsavel: "Gestão de Transporte",
      status: "pendente",
      historico: [{ data: new Date().toISOString(), status: "pendente", por: user.nome }]
    };
    addItem("solicitacoes", payload);
    toast({ title: "Solicitação enviada", description: "Encaminhada ao setor responsável." });
    setForm({ veiculoId: "", data: "", destino: "", motivo: "", duracaoHoras: 1 });
  };

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="container mx-auto py-6 max-w-3xl">
        <h1 className="text-2xl font-semibold mb-4">Solicitar Veículo</h1>
        <form onSubmit={submit} className="space-y-4 bg-card border rounded-lg p-6">
          <div>
            <label className="text-sm text-muted-foreground">Veículo</label>
            <Select value={form.veiculoId} onValueChange={(v) => setForm({ ...form, veiculoId: v })}>
              <SelectTrigger><SelectValue placeholder="Selecione um veículo disponível" /></SelectTrigger>
              <SelectContent>
                {veiculos.map(v => (
                  <SelectItem key={v.id} value={v.id}>{v.modelo} • {v.placa}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Data</label>
            <Input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Destino</label>
            <Input value={form.destino} onChange={(e) => setForm({ ...form, destino: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Motivo</label>
            <Input value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Duração (horas)</label>
            <Input type="number" min={1} value={form.duracaoHoras} onChange={(e) => setForm({ ...form, duracaoHoras: Number(e.target.value) })} required />
          </div>
          <Button variant="brand" type="submit">Enviar Solicitação</Button>
        </form>
      </main>
    </div>
  );
}
