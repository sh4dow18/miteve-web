// Report Bug Page Layout Requirements
import { Metadata } from "next";
// Report Bug Page Layout Metadata
export const metadata: Metadata = {
  title: "Reportar Problema",
  description:
    "Ayuda a tener el sistema al día reportando los problemas que encuentres en Miteve",
};
// Report Bug Page Layout Props
interface Props {
  children: React.ReactNode;
}
// Report Bug Page Layout Main Function
function ReportBugLayout({ children }: Props) {
  return children;
}
export default ReportBugLayout;