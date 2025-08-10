import TopNav from "@/components/layout/TopNav";
import EntityManager from "@/components/EntityManager";

export default function VehiclesPage() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <EntityManager
        storageKey="veiculos"
        title="Veículos"
        columns={[
          { key: "placa", label: "Placa" },
          { key: "modelo", label: "Modelo" },
          { key: "ano", label: "Ano" },
          { key: "capacidade", label: "Capacidade" },
          { key: "status", label: "Status" },
          { key: "quilometragem", label: "Km" },
          { key: "dataUltimaManutencao", label: "Última Manutenção" },
        ]}
        fields={[
          { key: "placa", label: "Placa", type: "text" },
          { key: "modelo", label: "Modelo", type: "text" },
          { key: "ano", label: "Ano", type: "number" },
          { key: "capacidade", label: "Capacidade", type: "number" },
          { key: "status", label: "Status", type: "select", options: [
            { label: "Disponível", value: "disponivel" },
            { label: "Em Manutenção", value: "manutencao" },
            { label: "Reservado", value: "reservado" },
          ] },
          { key: "quilometragem", label: "Quilometragem", type: "number" },
          { key: "dataUltimaManutencao", label: "Data da Última Manutenção", type: "date" },
        ]}
      />
    </div>
  );
}
