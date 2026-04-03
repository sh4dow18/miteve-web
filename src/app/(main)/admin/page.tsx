"use client";

import { useEffect, useState } from "react";
import { Film, Folder, Tag, ArrowLeft, Database, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ContainerRequest,
  ContentRequest,
  Episode,
  Genre,
  GenreRequest,
  MiniContainer,
  MiniSeason,
  Season,
  ShortContent,
  TabType,
} from "@/types";
import { TabButton } from "@/components/TabButton";
import { ContentTab } from "@/components/ContentTab";
import { ContainersTab } from "@/components/ContainersTab";
import { GenresTab } from "@/components/GenresTab";
import {
  FindAllContainers,
  FindAllContents,
  FindAllGenres,
} from "@/services/api";
import { API_HOST_IP } from "@/services/admin";
import SeasonsTab from "@/components/SeasonsTab";
import EpisodesTab from "@/components/EpisodesTab";

export default function Admin() {
  const navigate = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("content");
  const [searchTerm, setSearchTerm] = useState("");

  // State
  const [contents, setContents] = useState<ShortContent[]>([]);

  const [containers, setContainers] = useState<MiniContainer[]>([]);

  const [genres, setGenres] = useState<Genre[]>([]);

  const [seasons, setSeasons] = useState<Season[]>([
    { id: "1", seasonNumber: 1, episodesList: [] },
  ]);

  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    const GetData = async () => {
      setContainers(await FindAllContainers());
      setGenres(await FindAllGenres());
      setContents(await FindAllContents());
    };
    GetData();
  }, []);

  // ➕ CREATE
  const handleAddContent = async (data: ContentRequest) => {
    try {
      const res = await fetch(`${API_HOST_IP}/contents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error creando contenido");

      setContents(await FindAllContents());
    } catch (err) {
      console.error(err);
    }
  };

  // ✏️ UPDATE
  const handleEditContent = async (id: string, data: ContentRequest) => {
    try {
      const res = await fetch(`${API_HOST_IP}/contents/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error actualizando contenido");

      setContents(await FindAllContents());
    } catch (err) {
      console.error(err);
    }
  };

  // Container handlers
  const handleAddContainer = async (data: ContainerRequest) => {
    try {
      const res = await fetch(`${API_HOST_IP}/containers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error creando contenido");

      setContainers(await FindAllContainers());
    } catch (err) {
      console.error(err);
    }
  };
  const handleEditContainer = async (
    id: number | string,
    data: ContainerRequest
  ) => {
    try {
      const res = await fetch(`${API_HOST_IP}/containers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error actualizando contenido");

      setContainers(await FindAllContainers());
    } catch (err) {
      console.error(err);
    }
  };

  // Genre handlers
  const handleAddGenre = async (data: GenreRequest) => {
    try {
      const res = await fetch(`${API_HOST_IP}/genres`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error creando contenido");

      setGenres(await FindAllGenres());
    } catch (err) {
      console.error(err);
    }
  };
  const handleEditGenre = async (id: number | string, data: GenreRequest) => {
    try {
      const res = await fetch(`${API_HOST_IP}/genres/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error actualizando contenido");

      setGenres(await FindAllGenres());
    } catch (err) {
      console.error(err);
    }
  };
  const handleEditEpisode = async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_HOST_IP}/episodes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error actualizando contenido");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-800">
        <div className="px-12 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate.push("/browse")}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              tabIndex={0}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-semibold">Panel de Administración</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-12 flex gap-6 overflow-x-auto scrollbar-hide">
          <TabButton
            active={activeTab === "content"}
            onClick={() => setActiveTab("content")}
            icon={<Database className="w-5 h-5" />}
            label="Contenido"
          />
          <TabButton
            active={activeTab === "containers"}
            onClick={() => setActiveTab("containers")}
            icon={<Folder className="w-5 h-5" />}
            label="Contenedores"
          />
          <TabButton
            active={activeTab === "genres"}
            onClick={() => setActiveTab("genres")}
            icon={<Tag className="w-5 h-5" />}
            label="Géneros"
          />
          <TabButton
            active={activeTab === "seasons"}
            onClick={() => setActiveTab("seasons")}
            icon={<Film className="w-5 h-5" />}
            label="Temporadas"
          />
          <TabButton
            active={activeTab === "episodes"}
            onClick={() => setActiveTab("episodes")}
            icon={<Play className="w-5 h-5" />}
            label="Episodios"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-12 py-8">
        {activeTab === "content" && (
          <ContentTab
            contents={contents}
            containers={containers}
            genres={genres}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAdd={handleAddContent}
            onEdit={handleEditContent}
          />
        )}
        {activeTab === "containers" && (
          <ContainersTab
            containers={containers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAdd={handleAddContainer}
            onEdit={handleEditContainer}
          />
        )}
        {activeTab === "genres" && (
          <GenresTab
            genres={genres}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAdd={handleAddGenre}
            onEdit={handleEditGenre}
          />
        )}
        {activeTab === "seasons" && (
          <SeasonsTab
            contents={contents}
          />
        )}
        {activeTab === "episodes" && (
          <EpisodesTab
            contents={contents}
            onEdit={handleEditEpisode}
          />
        )}
      </div>
    </div>
  );
}
