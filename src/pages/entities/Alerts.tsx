import TopNav from "@/components/layout/TopNav";
import EntityManager from "@/components/EntityManager";

export default function AlertsPage() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <EntityManager
        storageKey="alertas"
        title="Alertas"
        columns={[
          { key: "tipo", label: "Tipo" },
          { key: "descricao", label: "Descrição" },
          { key: "data", label: "Data" },
          { key: "veiculoId", label: "Veículo (ID)" },
        ]}
        fields={[
          { key: "tipo", label: "Tipo", type: "text" },
          { key: "descricao", label: "Descrição", type: "textarea" },
          { key: "data", label: "Data", type: "date" },
          { key: "veiculoId", label: "Veículo (ID)", type: "text" },
        ]}
      />
    </div>
  );
}
