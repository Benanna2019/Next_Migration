import Link from "next/link";
import { LabelText } from "@/components";
import { currencyFormatter } from "@/utils";
import { Deposits, LineItemDisplay } from "@/components/deposit";
import { LineItem } from "@prisma/client";
import { redirect } from "next/navigation";
import { getInvoiceDetails } from "@/models/invoiceserver";

export const lineItemClassName =
  "flex justify-between border-t border-gray-100 py-4 text-[14px] leading-[24px]";

async function InvoiceRoute({ params }: { params: { invoiceId: string } }) {
  const { invoiceId } = params;

  const invoiceDetails = await getInvoiceDetails(invoiceId);
  if (!invoiceDetails) {
    return redirect("/login");
  }
  const invoiceData = {
    customerName: invoiceDetails.invoice.customer.name,
    customerId: invoiceDetails.invoice.customer.id,
    totalAmount: invoiceDetails.totalAmount,
    dueStatus: invoiceDetails.dueStatus,
    dueDisplay: invoiceDetails.dueStatusDisplay,
    invoiceDateDisplay: invoiceDetails.invoice.invoiceDate.toLocaleDateString(),
    lineItems: invoiceDetails.invoice.lineItems.map((li) => ({
      id: li.id,
      description: li.description,
      quantity: li.quantity,
      unitPrice: li.unitPrice,
    })),
    deposits: invoiceDetails.invoice.deposits.map((deposit) => ({
      id: deposit.id,
      amount: deposit.amount,
      depositDateFormatted: deposit.depositDate.toLocaleDateString(),
    })),
    invoiceId: invoiceId,
  };

  return (
    <>
      <div className="relative p-10">
        <Link
          href={`/sales/customers/${invoiceData.customerId}`}
          className="text-[length:14px] font-bold leading-6 text-blue-600 underline"
        >
          {invoiceData.customerName}
        </Link>
        <div className="text-[length:32px] font-bold leading-[40px]">
          {currencyFormatter.format(invoiceData.totalAmount)}
        </div>
        <LabelText>
          <span
            className={
              invoiceData.dueStatus === "paid"
                ? "text-green-brand"
                : invoiceData.dueStatus === "overdue"
                ? "text-red-brand"
                : ""
            }
          >
            {invoiceData.dueDisplay}
          </span>
          {` • Invoiced ${invoiceData.invoiceDateDisplay}`}
        </LabelText>
        <div className="h-4" />
        {invoiceData.lineItems.map((item) => (
          <LineItemDisplay
            key={item.id}
            description={item.description}
            unitPrice={item.unitPrice}
            quantity={item.quantity}
          />
        ))}
        <div className={`${lineItemClassName} font-bold`}>
          <div>Net Total</div>
          <div>{currencyFormatter.format(invoiceData.totalAmount)}</div>
        </div>
        <div className="h-8" />
        <Deposits data={invoiceData} />
      </div>
    </>
  );
}

export default InvoiceRoute;
