import EntityManager from "@/components/EntityManager";

export default function ServersPage() {
  return (
    <div className="min-h-screen">
      
      <EntityManager
        storageKey="servidores"
        title="Servidores"
        columns={[
          { key: "nome", label: "Nome" },
          { key: "matricula", label: "Matrícula" },
          { key: "setor", label: "Setor" },
          { key: "perfil", label: "Perfil" },
        ]}
        fields={[
          { key: "nome", label: "Nome", type: "text" },
          { key: "matricula", label: "Matrícula", type: "text" },
          { key: "setor", label: "Setor", type: "text" },
          { key: "perfil", label: "Perfil", type: "select", options: [
            { label: "Admin", value: "administrador" },
            { label: "Usuário", value: "usuario" },
            { label: "Motorista", value: "motorista" },
            { label: "Gestor", value: "gestor" },
          ] },
        ]}
      />
    </div>
  );
}
