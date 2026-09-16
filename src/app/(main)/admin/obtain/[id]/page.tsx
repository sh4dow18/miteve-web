import { ObtainContentPipelinePage } from "@/features/admin/ui/ObtainContentPipelinePage";

export const metadata = {
  title: "Obtener Contenido - Pipeline",
  description: "Pipeline para descargar, transformar, subir y registrar contenido sugerido.",
};

export default async function AdminObtainPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reportId = Number(id);
  return <ObtainContentPipelinePage reportId={reportId} />;
}
