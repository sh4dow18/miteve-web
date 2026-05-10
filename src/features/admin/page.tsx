"use client";

import { ADMIN_TABS } from "@/features/admin/config/tabs";
import { useAdmin } from "@/features/admin/model/useAdmin";
import {
  ContentTab,
  ContainersTab,
  EpisodesTab,
  GenresTab,
  SeasonsTab,
} from "@/features/admin/ui/tabs";
import { TabButton } from "@/shared/ui/TabButton";

export default function AdminPage() {
  const {
    activeTab,
    searchTerm,
    contents,
    containers,
    genres,
    loading,
    setActiveTab,
    setSearchTerm,
    addContent,
    editContent,
    addContainer,
    editContainer,
    addGenre,
    editGenre,
    editEpisode,
  } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 py-16 md:px-4 md:py-4 lg:px-6">
      <div className="w-full space-y-6 p-5">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-gray-400">
            Gestiona contenido, contenedores, géneros, temporadas y episodios.
          </p>
        </header>

        <div className="overflow-x-auto border-b border-gray-800">
          <div className="flex gap-6 min-w-max">
            {ADMIN_TABS.map((tab) => (
              <TabButton
                key={tab.key}
                active={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                icon={<tab.icon className="w-4 h-4" />}
                label={tab.label}
              />
            ))}
          </div>
        </div>

        {activeTab === "content" && (
          <ContentTab
            contents={contents}
            containers={containers}
            genres={genres}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAdd={(data) => void addContent(data)}
            onEdit={(id, data) => void editContent(id, data)}
          />
        )}

        {activeTab === "containers" && (
          <ContainersTab
            containers={containers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAdd={(data) => void addContainer(data)}
            onEdit={(id, data) => void editContainer(id, data)}
          />
        )}

        {activeTab === "genres" && (
          <GenresTab
            genres={genres}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAdd={(data) => void addGenre(data)}
            onEdit={(id, data) => void editGenre(id, data)}
          />
        )}

        {activeTab === "seasons" && <SeasonsTab contents={contents} />}

        {activeTab === "episodes" && (
          <EpisodesTab
            contents={contents}
            onEdit={(id, data) => editEpisode(id, data)}
          />
        )}
      </div>
    </div>
  );
}
