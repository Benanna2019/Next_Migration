// @ts-nocheck
import { currencyFormatter } from "../../utils";
import Link from "next/link";
import { CustomerSkeleton } from "../customer-layout";
import { ErrorBoundaryComponent } from "../error-boundary";
import { getCustomerDetails, getCustomerInfo } from "@/models/customerserver";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const lineItemClassName = "border-t border-gray-100 text-[14px] h-[56px]";

export const dynamic = "force-dynamic";

export default function CustomerIdPage({ customerId }: { customerId: string }) {
  return (
    <>
      <ErrorBoundaryComponent>
        <div className="relative p-10">
          <Suspense fallback={<CustomerSkeleton />}>
            <CustomerInfo customerId={customerId} />
          </Suspense>
          <Suspense fallback={<CustomerSkeleton />}>
            <CustomerDetails customerId={customerId} />
          </Suspense>
        </div>
      </ErrorBoundaryComponent>
    </>
  );
}

async function CustomerInfo({ customerId }: { customerId: string }) {
  const customerInfo = await getCustomerInfo(customerId);
  if (!customerInfo) {
    return redirect("/login");
  }

  return (
    <>
      <div className="text-[length:14px] font-bold leading-6">
        {customerInfo.email}
      </div>
      <div className="text-[length:32px] font-bold leading-[40px]">
        {customerInfo.name}
      </div>
      <div className="h-4" />
      <div className="text-m-h3 font-bold leading-8">Invoices</div>
      <div className="h-4" />
    </>
  );
}

async function CustomerDetails({ customerId }: { customerId: string }) {
  const customerDetails = await getCustomerDetails(customerId);

  return (
    <table className="w-full">
      <tbody>
        {customerDetails?.invoiceDetails.map((details: any) => (
          <tr key={details.id} className={lineItemClassName}>
            <td>
              <Link
                className="text-blue-600 underline"
                href={`/sales/invoices/${details.id}`}
              >
                {details.number}
              </Link>
            </td>
            <td
              className={
                "text-center uppercase" +
                " " +
                (details.dueStatus === "paid"
                  ? "text-green-brand"
                  : details.dueStatus === "overdue"
                  ? "text-red-brand"
                  : "")
              }
            >
              {details.dueStatusDisplay}
            </td>
            <td className="text-right">
              {currencyFormatter.format(details.totalAmount)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
