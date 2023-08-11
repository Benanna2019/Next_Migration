import SalesNav from "@/components/sales-nav";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

function SalesLayout({ children }: { children: React.ReactNode }) {
  const session = getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return <SalesNav>{children}</SalesNav>;
}

export default SalesLayout;
