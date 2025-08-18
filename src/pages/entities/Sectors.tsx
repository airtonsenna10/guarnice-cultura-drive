import EntityManager from "@/components/EntityManager";

export default function SectorsPage() {
  return (
    <div className="min-h-screen">
      
      <EntityManager
        storageKey="setores"
        title="Setores"
        columns={[
          { key: "nome", label: "Nome" },
          { key: "descricao", label: "Descrição" },
        ]}
        fields={[
          { key: "nome", label: "Nome do Setor", type: "text" },
          { key: "descricao", label: "Descrição", type: "textarea" },
        ]}
      />
    </div>
  );
}
