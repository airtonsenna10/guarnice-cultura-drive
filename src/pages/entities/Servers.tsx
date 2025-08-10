import TopNav from "@/components/layout/TopNav";
import EntityManager from "@/components/EntityManager";

export default function ServersPage() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <EntityManager
        storageKey="servidores"
        title="Servidores"
        columns={[
          { key: "nome", label: "Nome" },
          { key: "matricula", label: "Matrícula" },
          { key: "setor", label: "Setor" },
          { key: "cargo", label: "Cargo" },
          { key: "contato", label: "Contato" },
        ]}
        fields={[
          { key: "nome", label: "Nome", type: "text" },
          { key: "matricula", label: "Matrícula", type: "text" },
          { key: "setor", label: "Setor", type: "text" },
          { key: "cargo", label: "Cargo", type: "text" },
          { key: "contato", label: "Contato", type: "text" },
        ]}
      />
    </div>
  );
}
