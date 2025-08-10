import TopNav from "@/components/layout/TopNav";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { listAll, updateItem } from "@/services/localdb";
import { SolicitacaoVeiculo, Veiculo } from "@/services/types";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Approvals() {
  const [items, setItems] = useState<SolicitacaoVeiculo[]>([]);
  const [mapVeiculos, setMapVeiculos] = useState<Record<string, Veiculo>>({});
  const [just, setJust] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const veiculos = listAll<Veiculo>("veiculos");
    setMapVeiculos(Object.fromEntries(veiculos.map(v => [v.id, v])));
    setItems(listAll<SolicitacaoVeiculo>("solicitacoes").filter(s => s.status === "pendente"));
  }, []);

  const act = (s: SolicitacaoVeiculo, aprovar: boolean) => {
    const status = aprovar ? "aprovada" : "rejeitada";
    updateItem<SolicitacaoVeiculo>("solicitacoes", s.id, {
      status,
      justificativa: just[s.id],
      historico: [...s.historico, { data: new Date().toISOString(), status, por: user?.nome || "sistema", justificativa: just[s.id] }]
    });
    toast({ title: `Solicitação ${status}`, description: aprovar ? "Aprovada com sucesso." : "Rejeitada com justificativa." });
    setItems(prev => prev.filter(i => i.id !== s.id));
  };

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="container mx-auto py-6">
        <h1 className="text-2xl font-semibold mb-4">Autorizações Pendentes</h1>
        <div className="grid gap-4">
          {items.map(s => (
            <div key={s.id} className="border rounded-lg p-4 bg-card">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-medium">{mapVeiculos[s.veiculoId]?.modelo} • {mapVeiculos[s.veiculoId]?.placa}</p>
                  <p className="text-sm text-muted-foreground">Servidor: {s.servidor} • Data: {s.data}</p>
                  <p className="text-sm">Destino: {s.destino} • Motivo: {s.motivo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="brand" onClick={() => act(s, true)}>Aprovar</Button>
                  <Button variant="destructive" onClick={() => act(s, false)}>Rejeitar</Button>
                </div>
              </div>
              <div className="mt-3">
                <label className="text-sm text-muted-foreground">Justificativa (obrigatória ao rejeitar)</label>
                <Textarea value={just[s.id] || ""} onChange={(e) => setJust({ ...just, [s.id]: e.target.value })} />
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-muted-foreground">Sem solicitações pendentes.</p>
          )}
        </div>
      </main>
    </div>
  );
}
