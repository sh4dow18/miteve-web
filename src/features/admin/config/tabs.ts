import type { TabType } from "@/entities/content/model/types";
import {
  Bug,
  Clapperboard,
  Folder,
  Layers,
  ListVideo,
  ShieldCheck,
  Tag,
  Lightbulb,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

interface AdminTab {
  key: TabType;
  label: string;
  icon: LucideIcon;
}

export const ADMIN_TABS: AdminTab[] = [
  { key: "content", label: "Contenido", icon: Clapperboard },
  { key: "containers", label: "Contenedores", icon: Folder },
  { key: "genres", label: "Géneros", icon: Tag },
  { key: "seasons", label: "Temporadas", icon: Layers },
  { key: "episodes", label: "Episodios", icon: ListVideo },
  { key: "bug-reports", label: "Reportes de Bug", icon: Bug },
  { key: "suggested-content", label: "Sugerencias de Contenido", icon: Lightbulb },
  { key: "privileges", label: "Privilegios", icon: ShieldCheck },
  { key: "roles", label: "Roles", icon: UserCog },
  { key: "users", label: "Usuarios", icon: Users },
];
