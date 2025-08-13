import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { listAll, addItem } from "@/services/localdb";
import { SolicitacaoVeiculo, Veiculo } from "@/services/types";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Requests() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoVeiculo[]>([]);
  const [filters, setFilters] = useState<{ nome: string; data: string; status: "todas" | "pendente" | "aprovada" | "rejeitada" }>({ nome: "", data: "", status: "todas" });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ veiculoId: "", data: "", destino: "", motivo: "", duracaoHoras: 1 });
  useEffect(() => {
    setVeiculos(listAll<Veiculo>("veiculos").filter(v => v.status === "disponivel"));
    setSolicitacoes(listAll<SolicitacaoVeiculo>("solicitacoes"));
  }, []);

  useEffect(() => {
    document.title = "Solicitações de Veículos | Gestão de Frotas";
    const desc = "Gerencie, filtre e crie solicitações de uso de veículos.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.href;
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
    setSolicitacoes(listAll<SolicitacaoVeiculo>("solicitacoes"));
    setShowForm(false);
  };

  const vehicleMap = new Map(veiculos.map(v => [v.id, v]));
  const statusText: Record<SolicitacaoVeiculo["status"], string> = {
    pendente: "Aguardando",
    aprovada: "Aprovado",
    rejeitada: "Rejeitado",
  };
  const statusVariant: Record<SolicitacaoVeiculo["status"], "default" | "secondary" | "destructive" | "outline"> = {
    pendente: "secondary",
    aprovada: "default",
    rejeitada: "destructive",
  };
  const filteredSolicitacoes = solicitacoes.filter((s) => {
    const matchesNome = !filters.nome || s.servidor.toLowerCase().includes(filters.nome.toLowerCase());
    const matchesData = !filters.data || s.data.startsWith(filters.data);
    const matchesStatus = filters.status === "todas" || s.status === filters.status;
    return matchesNome && matchesData && matchesStatus;
  });

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-6 max-w-5xl">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Solicitações de Veículos</h1>
          <Button variant="brand" onClick={() => setShowForm(true)}>Nova Solicitação</Button>
        </header>

        <section aria-label="Filtros" className="bg-card border rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-muted-foreground">Nome do solicitante</label>
              <Input placeholder="Buscar por nome" value={filters.nome} onChange={(e) => setFilters({ ...filters, nome: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Data</label>
              <Input type="date" value={filters.data} onChange={(e) => setFilters({ ...filters, data: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Status</label>
              <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v as any })}>
                <SelectTrigger><SelectValue placeholder="Todos os status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todos</SelectItem>
                  <SelectItem value="pendente">Aguardando</SelectItem>
                  <SelectItem value="aprovada">Aprovado</SelectItem>
                  <SelectItem value="rejeitada">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section aria-label="Lista de solicitações" className="bg-card border rounded-lg">
          {filteredSolicitacoes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSolicitacoes.map((s) => {
                  const v = vehicleMap.get(s.veiculoId);
                  return (
                    <TableRow key={s.id}>
                      <TableCell>{s.servidor}</TableCell>
                      <TableCell>{v ? `${v.modelo} • ${v.placa}` : "—"}</TableCell>
                      <TableCell>{s.data}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[s.status]}>{statusText[s.status]}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="p-6 text-sm text-muted-foreground">Nenhuma solicitação encontrada.</div>
          )}
        </section>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent aria-describedby="nova-solicitacao-desc">
            <DialogHeader>
              <DialogTitle>Nova Solicitação</DialogTitle>
              <DialogDescription id="nova-solicitacao-desc">
                Preencha os dados para solicitar o uso do veículo.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-4">
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
              <div className="flex items-center gap-2">
                <Button variant="brand" type="submit">Enviar Solicitação</Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
