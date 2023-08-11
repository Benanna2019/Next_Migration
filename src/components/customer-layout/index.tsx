import { InvoiceDetailsFallback } from "../index";
import { Customer, getCustomerListItems } from "../../models/customerserver";
import BetterAddCustomerForm from "../full-stack-forms/add-customer";
import { ErrorBoundaryComponent } from "../error-boundary";
import CustomerLink from "./customer-link";
import { Suspense } from "react";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-gray-100">
      <ErrorBoundaryComponent>
        <div className="w-1/2 border-r border-gray-100">
          <div
            className={
              "block border-b-4 border-gray-100 py-3 px-4 hover:bg-gray-50"
            }
          >
            <BetterAddCustomerForm />
          </div>
          <Suspense fallback={<CustomerSkeleton />}>
            {/* @ts-expect-error */}
            <Customers />
          </Suspense>
        </div>
        <div className="flex w-1/2 flex-col justify-between">
          <>{children}</>
        </div>
      </ErrorBoundaryComponent>
    </div>
  );
}

export function CustomerSkeleton() {
  return (
    <div className="relative p-10">
      <InvoiceDetailsFallback />
    </div>
  );
}

async function Customers() {
  const customers = await getCustomerListItems();
  return (
    <div className="max-h-96 overflow-y-scroll">
      {customers?.map((customer: Pick<Customer, "email" | "id" | "name">) => (
        <CustomerLink key={customer.id} customer={customer}>
          <div className="flex justify-between text-[length:14px] font-bold leading-6">
            <div>{customer.name}</div>
          </div>
          <div className="flex justify-between text-[length:12px] font-medium leading-4 text-gray-400">
            <div>{customer.email}</div>
          </div>
        </CustomerLink>
      ))}
    </div>
  );
}
