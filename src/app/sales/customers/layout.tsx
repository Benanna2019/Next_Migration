import CustomerLayout from "@/components/customer-layout";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function CustomersLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return <CustomerLayout>{children}</CustomerLayout>;
}

export default CustomersLayout;
