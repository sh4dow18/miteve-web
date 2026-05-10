import {
  FindAllContainers,
  FindAllContents,
  FindAllGenres,
} from "@/entities/content/api";
import type {
  ContainerRequest,
  ContentRequest,
  EpisodeRequest,
  GenreRequest,
  MiniContainer,
  ShortContent,
  Genre,
  TabType,
} from "@/entities/content/model/types";
import { API_HOST_IP } from "@/shared/config/env";
import { useEffect, useState } from "react";

export function useAdmin() {
  const [activeTab, setActiveTab] = useState<TabType>("content");
  const [searchTerm, setSearchTerm] = useState("");
  const [contents, setContents] = useState<ShortContent[]>([]);
  const [containers, setContainers] = useState<MiniContainer[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [contentsData, containersData, genresData] = await Promise.all([
        FindAllContents(),
        FindAllContainers(),
        FindAllGenres(),
      ]);
      setContents(contentsData);
      setContainers(containersData);
      setGenres(genresData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const requestJson = async (url: string, method: string, body: unknown) => {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${method} ${url}`);
    }

    return response;
  };

  const addContent = async (data: ContentRequest) => {
    await requestJson(`${API_HOST_IP}/contents`, "POST", data);
    await loadData();
  };

  const editContent = async (id: string, data: ContentRequest) => {
    await requestJson(`${API_HOST_IP}/contents/${id}`, "PUT", data);
    await loadData();
  };

  const addContainer = async (data: ContainerRequest) => {
    await requestJson(`${API_HOST_IP}/containers`, "POST", data);
    await loadData();
  };

  const editContainer = async (id: number | string, data: ContainerRequest) => {
    await requestJson(`${API_HOST_IP}/containers/${id}`, "PUT", data);
    await loadData();
  };

  const addGenre = async (data: GenreRequest) => {
    await requestJson(`${API_HOST_IP}/genres`, "POST", data);
    await loadData();
  };

  const editGenre = async (id: number | string, data: GenreRequest) => {
    await requestJson(`${API_HOST_IP}/genres/${id}`, "PUT", data);
    await loadData();
  };

  const editEpisode = async (id: string, data: EpisodeRequest) => {
    await requestJson(`${API_HOST_IP}/episodes/${id}`, "PUT", data);
  };

  return {
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
  };
}
