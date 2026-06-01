import { useEffect, useState } from "react";
import { API_HOST_IP } from "@/shared/config/env";
import { getToken } from "@/shared/lib/auth";
import type { Privilege, Role, RoleRequest } from "@/entities/content/model/types";

function authHeaders() {
  const token = getToken();
  const base: Record<string, string> = { "Content-Type": "application/json" };
  if (token) base["Authorization"] = `Bearer ${token}`;
  return base;
}

export function useRolesTab() {
  const [items, setItems] = useState<Role[]>([]);
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Role | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [rolesRes, privRes] = await Promise.all([
        fetch(`${API_HOST_IP}/roles`, { headers: authHeaders() }),
        fetch(`${API_HOST_IP}/privileges`, { headers: authHeaders() }),
      ]);
      if (!rolesRes.ok) throw new Error("Error al cargar roles.");
      if (!privRes.ok) throw new Error("Error al cargar privilegios.");
      const [roles, privs]: [Role[], Privilege[]] = await Promise.all([
        rolesRes.json(),
        privRes.json(),
      ]);
      setItems(roles);
      setPrivileges(privs);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  async function add(data: RoleRequest) {
    const res = await fetch(`${API_HOST_IP}/roles`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear rol.");
    const created: Role = await res.json();
    setItems((prev) => [...prev, created]);
  }

  async function edit(id: number, data: Partial<RoleRequest>) {
    const res = await fetch(`${API_HOST_IP}/roles/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar rol.");
    const updated: Role = await res.json();
    setItems((prev) => prev.map((r) => (r.id === id ? updated : r)));
  }

  async function remove(id: number) {
    const res = await fetch(`${API_HOST_IP}/roles/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Error al eliminar rol.");
    setItems((prev) => prev.filter((r) => r.id !== id));
  }

  function handleOpenAdd() {
    setEditingItem(null);
    setShowModal(true);
  }

  function handleOpenEdit(item: Role) {
    setEditingItem(item);
    setShowModal(true);
  }

  function handleClose() {
    setShowModal(false);
    setEditingItem(null);
  }

  async function handleSave(data: RoleRequest) {
    if (editingItem) {
      await edit(editingItem.id, data);
    } else {
      await add(data);
    }
    handleClose();
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar este rol?")) return;
    await remove(id);
  }

  const filtered = items.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    items: filtered,
    privileges,
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
