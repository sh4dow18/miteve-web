import { FindContentById } from "@/entities/content/api";
import { ROUTES_MAP } from "@/shared/config/routes";
import type { Metadata } from "next";

interface PageParams {
  id: string;
}

export async function getContentDetailData(params: PageParams) {
  return FindContentById(params.id);
}

export async function getContentDetailMetadata(
  params: PageParams
): Promise<Metadata> {
  try {
    const content = await FindContentById(params.id);
    if (!content) throw new Error();
    return {
      title: content.title,
      description: content.description,
    };
  } catch {
    return {
      title: ROUTES_MAP["content/[id]"].metadata.title,
      description: ROUTES_MAP["content/[id]"].metadata.description,
    };
  }
}
