import CustomerIdPage from "@/components/customer-id-page";

async function CustomerIdRoute({ params }: { params: { customerId: string } }) {
  const { customerId } = params;

  return <CustomerIdPage customerId={customerId} />;
}

export default CustomerIdRoute;
