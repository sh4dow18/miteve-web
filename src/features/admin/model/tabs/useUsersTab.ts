import { useEffect, useState } from "react";
import { API_HOST_IP } from "@/shared/config/env";
import { getToken } from "@/shared/lib/auth";
import type { AppUser, MiniRole } from "@/entities/content/model/types";

function authHeaders() {
  const token = getToken();
  const base: Record<string, string> = { "Content-Type": "application/json" };
  if (token) base["Authorization"] = `Bearer ${token}`;
  return base;
}

interface UserUpdateFields {
  email?: string;
  password?: string;
  roleId?: number;
}

export function useUsersTab() {
  const [items, setItems] = useState<AppUser[]>([]);
  const [roles, setRoles] = useState<MiniRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<AppUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        fetch(`${API_HOST_IP}/users`, { headers: authHeaders() }),
        fetch(`${API_HOST_IP}/roles`, { headers: authHeaders() }),
      ]);
      if (!usersRes.ok) throw new Error("Error al cargar usuarios.");
      if (!rolesRes.ok) throw new Error("Error al cargar roles.");
      const [users, rolesData]: [AppUser[], MiniRole[]] = await Promise.all([
        usersRes.json(),
        rolesRes.json(),
      ]);
      setItems(users);
      setRoles(rolesData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  async function add(data: { name: string; email: string; password: string; roleId: number }) {
    const res = await fetch(`${API_HOST_IP}/users`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear usuario.");
    const created: AppUser = await res.json();
    setItems((prev) => [...prev, created]);
  }

  async function edit(id: number, data: UserUpdateFields) {
    const res = await fetch(`${API_HOST_IP}/users/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar usuario.");
    const updated: AppUser = await res.json();
    setItems((prev) => prev.map((u) => (u.id === id ? updated : u)));
  }

  async function remove(id: number) {
    const res = await fetch(`${API_HOST_IP}/users/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Error al eliminar usuario.");
    setItems((prev) => prev.filter((u) => u.id !== id));
  }

  function handleOpenAdd() {
    setEditingItem(null);
    setShowModal(true);
  }

  function handleOpenEdit(item: AppUser) {
    setEditingItem(item);
    setShowModal(true);
  }

  function handleClose() {
    setShowModal(false);
    setEditingItem(null);
  }

  async function handleSaveAdd(data: { name: string; email: string; password: string; roleId: number }) {
    await add(data);
    handleClose();
  }

  async function handleSaveEdit(id: number, data: UserUpdateFields) {
    await edit(id, data);
    handleClose();
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar este usuario?")) return;
    await remove(id);
  }

  const filtered = items.filter((u) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    items: filtered,
    roles,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    editingItem,
    showModal,
    handleOpenAdd,
    handleOpenEdit,
    handleClose,
    handleSaveAdd,
    handleSaveEdit,
    handleDelete,
  };
}
