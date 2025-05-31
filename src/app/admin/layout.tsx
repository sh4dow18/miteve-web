// Admin Layout Requirements
import { Metadata } from "next";
// Admin Layout Metadata
export const metadata: Metadata = {
  title: "Administración",
  description: "En esta página se puede administrar el contenido",
};
// Admin Layout Main Function
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
