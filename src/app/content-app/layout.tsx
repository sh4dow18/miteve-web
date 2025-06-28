// Content App Page Layout Requirements
import { Metadata } from "next";
// Content App Page Layout Metadata
export const metadata: Metadata = {
  title: "Solicitar Contenido",
  description:
    "Ayuda indicando que te gustaría ver en Miteve",
};
// Content App Page Layout Props
interface Props {
  children: React.ReactNode;
}
// Content App Page Layout Main Function
function ReportBugLayout({ children }: Props) {
  return children;
}
export default ReportBugLayout;