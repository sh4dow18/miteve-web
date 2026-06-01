import { useEffect, useState } from "react";
import { API_HOST_IP } from "@/shared/config/env";
import { getToken } from "@/shared/lib/auth";
import type { Privilege, PrivilegeRequest } from "@/entities/content/model/types";

function authHeaders() {
  const token = getToken();
  const base: Record<string, string> = { "Content-Type": "application/json" };
  if (token) base["Authorization"] = `Bearer ${token}`;
  return base;
}

export function usePrivilegesTab() {
  const [items, setItems] = useState<Privilege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Privilege | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_HOST_IP}/privileges`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Error al cargar privilegios.");
      setItems(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  async function add(data: PrivilegeRequest) {
    const res = await fetch(`${API_HOST_IP}/privileges`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear privilegio.");
    const created: Privilege = await res.json();
    setItems((prev) => [...prev, created]);
  }

  async function edit(id: number, data: Partial<PrivilegeRequest>) {
    const res = await fetch(`${API_HOST_IP}/privileges/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar privilegio.");
    const updated: Privilege = await res.json();
    setItems((prev) => prev.map((p) => (p.id === id ? updated : p)));
  }

  async function remove(id: number) {
    const res = await fetch(`${API_HOST_IP}/privileges/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Error al eliminar privilegio.");
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function handleOpenAdd() {
    setEditingItem(null);
    setShowModal(true);
  }

  function handleOpenEdit(item: Privilege) {
    setEditingItem(item);
    setShowModal(true);
  }

  function handleClose() {
    setShowModal(false);
    setEditingItem(null);
  }

  async function handleSave(data: PrivilegeRequest) {
    if (editingItem) {
      await edit(editingItem.id, data);
    } else {
      await add(data);
    }
    handleClose();
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar este privilegio?")) return;
    await remove(id);
  }

  const filtered = items.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    items: filtered,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    editingItem,
    showModal,
    handleOpenAdd,
    handleOpenEdit,
    handleClose,
    handleSave,
    handleDelete,
  };
}
