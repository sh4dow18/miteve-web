import {
  FindAllContainers,
  FindAllContents,
  FindAllGenres,
  FindContentsPage,
  SearchContentsPage,
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
import { useCallback, useEffect, useRef, useState } from "react";

export function useAdmin() {
  const [activeTab, setActiveTab] = useState<TabType>("content");
  const [searchTerm, setSearchTerm] = useState("");
  const [contents, setContents] = useState<ShortContent[]>([]);
  const [containers, setContainers] = useState<MiniContainer[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  const [contentPage, setContentPage] = useState<ShortContent[]>([]);
  const [contentPageNumber, setContentPageNumber] = useState(0);
  const [contentTotalPages, setContentTotalPages] = useState(1);
  const [contentLoading, setContentLoading] = useState(true);

  const searchContentTitleRef = useRef("");
  const [contentSearchTerm, setContentSearchTerm] = useState("");

  const loadContentPage = useCallback(async (page: number, size = 20) => {
    setContentLoading(true);
    try {
      const title = searchContentTitleRef.current;
      const data = title
        ? await SearchContentsPage(title, page, size)
        : await FindContentsPage(page, size);
      setContentPage(data.content);
      setContentPageNumber(data.number);
      setContentTotalPages(data.totalPages);
    } finally {
      setContentLoading(false);
    }
  }, []);

  const searchContent = useCallback(
    (term: string) => {
      searchContentTitleRef.current = term;
      setContentSearchTerm(term);
      void loadContentPage(0);
    },
    [loadContentPage]
  );

  const loadData = async () => {
    try {
      const [contentsData, containersData, genresData, contentPageData] =
        await Promise.all([
          FindAllContents(),
          FindAllContainers(),
          FindAllGenres(),
          FindContentsPage(0),
        ]);
      setContents(contentsData);
      setContainers(containersData);
      setGenres(genresData);
      setContentPage(contentPageData.content);
      setContentPageNumber(contentPageData.number);
      setContentTotalPages(contentPageData.totalPages);
    } finally {
      setLoading(false);
      setContentLoading(false);
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
    contentPage,
    contentPageNumber,
    contentTotalPages,
    contentLoading,
    contentSearchTerm,
    setActiveTab,
    setSearchTerm,
    loadContentPage,
    searchContent,
    addContent,
    editContent,
    addContainer,
    editContainer,
    addGenre,
    editGenre,
    editEpisode,
  };
}
