import EntityManager from "@/components/EntityManager";
import { hash } from "@/services/localdb";

export default function UsersPage() {
  return (
    <div className="min-h-screen">
      
      <EntityManager
        storageKey="usuarios"
        title="Usuários"
        columns={[
          { key: "login", label: "Login" },
          { key: "nome", label: "Nome" },
          { key: "perfil", label: "Perfil" },
        ]}
        fields={[
          { key: "login", label: "Login", type: "text" },
          { key: "nome", label: "Nome", type: "text" },
          { key: "perfil", label: "Perfil", type: "select", options: [
            { label: "Administrador", value: "administrador" },
            { label: "Servidor", value: "servidor" },
            { label: "Motorista", value: "motorista" },
            { label: "Gestor", value: "gestor" },
          ] },
          { key: "senha", label: "Senha (será armazenada como hash)", type: "text" },
        ]}
        transformOnSave={async (data: any) => {
          if (data.senha) {
            const senhaHash = await hash(data.senha);
            delete data.senha;
            return { ...data, senhaHash };
          }
          return data;
        }}
      />
    </div>
  );
}
