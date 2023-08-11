import InvoicesPage from "@/components/invoice-page";

function InvoicesLayout({ children }: { children: React.ReactNode }) {
  return <InvoicesPage>{children}</InvoicesPage>;
}

export default InvoicesLayout;
