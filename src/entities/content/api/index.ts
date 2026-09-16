import { API_HOST_IP } from "@/shared/config/env";
import type {
  BatchUpdateEpisodesRequest,
  Container,
  Content,
  EpisodeMetadata,
  FullEpisode,
  Genre,
  GenrePageItem,
  MiniContainer,
  MiniContent,
  MiniSeason,
  NextEpisode,
  PageResponse,
  ShortContent,
} from "@/entities/content/model/types";

export async function FindAllMovies(): Promise<Container[]> {
  return await fetch(`${API_HOST_IP}/containers/type/1`).then((response) =>
    response.json()
  );
}

export async function FindAllTvShows(): Promise<Container[]> {
  return await fetch(`${API_HOST_IP}/containers/type/2`).then((response) =>
    response.json()
  );
}

export async function FindContentById(id: string): Promise<Content | null> {
  const response = await fetch(`${API_HOST_IP}/contents/${id}`);
  if (!response.ok) return null;
  return response.json();
}

export async function FindRecentContent(): Promise<Content[]> {
  return await fetch(`${API_HOST_IP}/contents/recent`).then((response) =>
    response.json()
  );
}

export async function FindComingSoonContent(): Promise<Content[]> {
  return await fetch(`${API_HOST_IP}/contents/soon`).then((response) =>
    response.json()
  );
}

export async function FindEpisodeMetadataById(
  id: string
): Promise<EpisodeMetadata> {
  return await fetch(`${API_HOST_IP}/episodes/metadata/${id}`).then(
    (response) => response.json()
  );
}

export async function FindNextEpisodeById(
  id: string
): Promise<NextEpisode | null> {
  const response = await fetch(`${API_HOST_IP}/episodes/next/${id}`);
  if (!response.ok) {
    return null;
  }
  return await response.json();
}

export async function FindAllContents(): Promise<ShortContent[]> {
  const data = await fetch(`${API_HOST_IP}/contents?page=0&size=9999`).then(
    (response) => response.json()
  );
  return Array.isArray(data) ? data : (data.content ?? []);
}

export async function FindContentsPage(
  page = 0,
  size = 20
): Promise<PageResponse<ShortContent>> {
  const response = await fetch(
    `${API_HOST_IP}/contents?page=${page}&size=${size}`
  );
  if (!response.ok) {
    throw new Error("Error al obtener contenidos paginados");
  }
  return response.json();
}

export async function SearchContentsPage(
  title: string,
  page = 0,
  size = 20
): Promise<PageResponse<ShortContent>> {
  const encodedTitle = encodeURIComponent(title);
  const response = await fetch(
    `${API_HOST_IP}/contents/search?title=${encodedTitle}&page=${page}&size=${size}`
  );
  if (!response.ok) {
    throw new Error("Error al buscar contenidos");
  }
  return response.json();
}

export async function FindAllContainers(): Promise<MiniContainer[]> {
  return await fetch(`${API_HOST_IP}/containers`).then((response) =>
    response.json()
  );
}

export async function FindContainerById(id: number, typeId: number): Promise<Container | null> {
  // Intento 1: tipo solicitado
  try {
    const res = await fetch(`${API_HOST_IP}/containers/type/${typeId}`);
    if (res.ok) {
      const containers: Container[] = await res.json();
      const found = containers.find((c) => c.id === id);
      if (found) return found;
    }
  } catch { /* ignore */ }

  // Intento 2: otro tipo (contenedores mixtos no aparecen en el filtro por tipo)
  try {
    const otherType = typeId === 1 ? 2 : 1;
    const res2 = await fetch(`${API_HOST_IP}/containers/type/${otherType}`);
    if (res2.ok) {
      const containers2: Container[] = await res2.json();
      const found2 = containers2.find((c) => c.id === id);
      if (found2) return found2;
    }
  } catch { /* ignore */ }

  // Fallback 3: contenedor mixto (ej: Amantes del Misterio id 13 tiene movies + tv-shows)
  // Se excluye de ambos /type/* por el query NOT EXISTS, así que lo reconstruimos
  // via /containers + detalle de contenidos. Ver ContainerRepository.kt:13
  console.log(`[DEBUG] FindContainerById fallback mixto para containerId=${id} typeId=${typeId}`);
  try {
    const allRes = await fetch(`${API_HOST_IP}/containers`);
    if (!allRes.ok) return null;
    const all: MiniContainer[] = await allRes.json();
    const meta = all.find((c) => c.id === id);
    if (!meta) return null;

    // Obtener ids de todos los contenidos (paginado)
    const pageRes = await fetch(`${API_HOST_IP}/contents?page=0&size=9999`);
    if (!pageRes.ok) return { id: meta.id, name: meta.name, elementsList: [] };
    const pageData = await pageRes.json();
    const shorts: ShortContent[] = Array.isArray(pageData) ? pageData : (pageData.content ?? []);
    // Fetch detalles en paralelo (limitado) para filtrar por container
    const details = await Promise.all(
      shorts.map((s) =>
        fetch(`${API_HOST_IP}/contents/${encodeURIComponent(s.id)}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    );
    const elements: Container["elementsList"] = details
      .filter((d): d is Content => !!d && d.container?.id === id)
      .map((d) => ({
        id: d.position ?? 0,
        position: d.position ?? 0,
        content: {
          id: d.id,
          cover: d.cover,
          title: d.title,
          trailer: d.trailer,
          age: d.age,
        },
      }))
      .sort((a, b) => a.position - b.position);

    console.log(`[DEBUG] FindContainerById mixto reconstruido containerId=${id} elements=${elements.length}`, elements.map(e=>`${e.position}:${e.content.title}`));
    return {
      id: meta.id,
      name: meta.name,
      elementsList: elements,
    };
  } catch (e) {
    console.log(`[DEBUG] FindContainerById fallback error`, e);
    return null;
  }
}

export async function FindAllGenres(): Promise<Genre[]> {
  return await fetch(`${API_HOST_IP}/genres`).then((response) =>
    response.json()
  );
}

export async function FindSeasonsByContentId(id: string): Promise<MiniSeason[]> {
  return await fetch(`${API_HOST_IP}/contents/${id}/seasons`).then(
    (response) => response.json()
  );
}

export async function FindEpisodesBySeasonId(id: string): Promise<FullEpisode[]> {
  return await fetch(`${API_HOST_IP}/seasons/${id}/episodes`).then(
    (response) => response.json()
  );
}

export async function FindContentsByNameLike(name: string): Promise<Content[]> {
  const term = name.trim();
  if (!term) {
    return [];
  }

  const encodedTerm = encodeURIComponent(term);
  const response = await fetch(`${API_HOST_IP}/contents/like/${encodedTerm}`);

  if (!response.ok) {
    return [];
  }

  return await response.json();
}

export async function FindSimilarContent(id: string, size = 5): Promise<MiniContent[]> {
  const response = await fetch(`${API_HOST_IP}/contents/${id}/similar?page=0&size=${size}`);
  if (!response.ok) return [];
  const data = await response.json();
  // Spring Boot returns a Page object: { content: [...], ... }
  return Array.isArray(data) ? data : (data.content ?? []);
}

export async function FindContentsByGenre(
  genreId: number,
  page = 0,
  size = 20
): Promise<{ items: GenrePageItem[]; totalPages: number }> {
  const response = await fetch(
    `${API_HOST_IP}/contents/genre/${genreId}?page=${page}&size=${size}`
  );
  if (!response.ok) return { items: [], totalPages: 0 };
  const data = await response.json();
  const items: GenrePageItem[] = Array.isArray(data) ? data : (data.content ?? []);
  const totalPages: number =
    typeof data.totalPages === "number" ? data.totalPages : 1;
  return { items, totalPages };
}

export async function BatchUpdateEpisodes(
  data: BatchUpdateEpisodesRequest
): Promise<void> {
  const response = await fetch(`${API_HOST_IP}/episodes/batch-update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al actualizar episodios en lote");
  }
}
