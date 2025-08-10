import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Field = {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "textarea" | "select";
  options?: { label: string; value: string }[];
};

interface Props<T extends { id: string }> {
  storageKey: string;
  title: string;
  columns: { key: keyof T | string; label: string }[];
  fields: Field[];
  transformOnSave?: (data: any) => any;
}

export default function EntityManager<T extends { id: string }>({ storageKey, title, columns, fields, transformOnSave }: Props<T>) {
  const [items, setItems] = useState<any[]>(() => JSON.parse(localStorage.getItem(storageKey) || "[]"));
  const [editing, setEditing] = useState<any | null>(null);

  const reset = () => setEditing({});

  const save = async () => {
    const now = new Date().toISOString();
    const payloadRaw = transformOnSave ? await transformOnSave(editing) : editing;
    const payload = payloadRaw ?? editing;
    if (editing.id) {
      const updated = items.map((i) => (i.id === editing.id ? { ...i, ...payload, updatedAt: now } : i));
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setItems(updated);
    } else {
      const entity = { id: crypto.randomUUID(), createdAt: now, updatedAt: now, ...payload };
      const updated = [entity, ...items];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setItems(updated);
    }
    setEditing(null);
  };
  const remove = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setItems(updated);
  };

  const headers = useMemo(() => columns.map((c) => c.label), [columns]);

  return (
    <section className="container mx-auto py-6">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <Button variant="brand" onClick={reset}>Novo</Button>
      </header>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-secondary/20">
            <tr>
              {headers.map((h) => (
                <th key={h} className="text-left p-3 font-medium">{h}</th>
              ))}
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                {columns.map((c) => (
                  <td key={String(c.key)} className="p-3">
                    {String(item[c.key as any] ?? "")}
                  </td>
                ))}
                <td className="p-3 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditing(item)}>Editar</Button>
                  <Button variant="destructive" size="sm" onClick={() => remove(item.id)}>Excluir</Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="p-6 text-center text-muted-foreground">Sem registros ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-background rounded-lg shadow-elevated w-full max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">{editing.id ? "Editar" : "Novo"} {title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((f) => (
                <div key={f.key} className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground" htmlFor={f.key}>{f.label}</label>
                  {f.type === "textarea" ? (
                    <Textarea id={f.key} value={editing[f.key] || ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} />
                  ) : f.type === "select" ? (
                    <Select value={editing[f.key] ?? ""} onValueChange={(v) => setEditing({ ...editing, [f.key]: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                      <SelectContent>
                        {f.options?.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input id={f.key} type={f.type} value={editing[f.key] || ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button variant="brand" onClick={save}>Salvar</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
