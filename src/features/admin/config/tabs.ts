import type { TabType } from "@/entities/content/model/types";
import {
  Clapperboard,
  Folder,
  Layers,
  ListVideo,
  Tag,
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
];
