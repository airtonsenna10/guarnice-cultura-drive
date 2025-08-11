import EntityManager from "@/components/EntityManager";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen">
      
      <EntityManager
        storageKey="manutencoes"
        title="Manutenções"
        columns={[
          { key: "tipo", label: "Tipo" },
          { key: "descricao", label: "Descrição" },
          { key: "veiculoId", label: "Veículo (ID)" },
          { key: "data", label: "Data" },
          { key: "custo", label: "Custo" },
          { key: "fornecedor", label: "Fornecedor" },
        ]}
        fields={[
          { key: "tipo", label: "Tipo", type: "text" },
          { key: "descricao", label: "Descrição", type: "textarea" },
          { key: "veiculoId", label: "Veículo (ID)", type: "text" },
          { key: "data", label: "Data", type: "date" },
          { key: "custo", label: "Custo", type: "number" },
          { key: "fornecedor", label: "Fornecedor", type: "text" },
        ]}
      />
    </div>
  );
}
