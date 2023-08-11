import Link from "next/link";
import { FilePlusIcon, LabelText } from "../index";
import { currencyFormatter } from "../../utils";
import CreateInvoiceForm from "../full-stack-forms/create-invoice";
import { getInvoiceListItems } from "@/models/invoiceserver";
import { Suspense } from "react";
import { CustomerSkeleton } from "../customer-layout";
import { getCustomerListItems } from "@/models/customerserver";

export default function InvoicesPage({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Suspense fallback={<CustomerSkeleton />}>
        {/* @ts-expect-error */}
        <OurInvoices />
      </Suspense>
      <div className="h-4" />
      <LabelText>Invoice List</LabelText>
      <div className="h-2" />

      <Suspense fallback={<CustomerSkeleton />}>
        {/* @ts-expect-error */}
        <InvoiceList>{children}</InvoiceList>
      </Suspense>
    </div>
  );
}

async function OurInvoices() {
  const invoiceListItems = await getInvoiceListItems();
  const dueSoonAmount = invoiceListItems.reduce((sum, li) => {
    if (li.dueStatus !== "due") {
      return sum;
    }
    const remainingBalance = li.totalAmount - li.totalDeposits;
    return sum + remainingBalance;
  }, 0);
  const overdueAmount = invoiceListItems.reduce((sum, li) => {
    if (li.dueStatus !== "overdue") {
      return sum;
    }
    const remainingBalance = li.totalAmount - li.totalDeposits;
    return sum + remainingBalance;
  }, 0);
  const allInvoicesData = {
    overdueAmount,
    dueSoonAmount,
  };

  const hundo = allInvoicesData.dueSoonAmount + allInvoicesData.overdueAmount;
  const dueSoonPercent = Math.floor(
    (allInvoicesData.dueSoonAmount / hundo) * 100
  );

  return (
    <div className="flex items-center justify-between gap-4">
      <InvoicesInfo label="Overdue" amount={allInvoicesData.overdueAmount} />
      <div className="flex h-4 flex-1 overflow-hidden rounded-full">
        <div className="bg-yellow-brand flex-1" />
        <div
          className="bg-green-brand"
          style={{ width: `${dueSoonPercent}%` }}
        />
      </div>
      <InvoicesInfo
        label="Due Soon"
        amount={allInvoicesData.dueSoonAmount}
        right
      />
    </div>
  );
}

function InvoicesInfo({
  label,
  amount,
  right,
}: {
  label: string;
  amount: number;
  right?: boolean;
}) {
  return (
    <div className={right ? "text-right" : ""}>
      <LabelText>{label}</LabelText>
      <div className="text-[length:18px] text-black">
        {currencyFormatter.format(amount)}
      </div>
    </div>
  );
}

async function InvoiceList({ children }: { children: React.ReactNode }) {
  const invoiceListItems = await getInvoiceListItems();
  const customers = await getCustomerListItems();

  return (
    <div className="flex overflow-hidden rounded-lg border border-gray-100">
      <div className="w-1/2 border-r border-gray-100">
        <div
          className={
            "block border-b-4 border-gray-100 py-3 px-4 hover:bg-gray-50"
          }
        >
          <CreateInvoiceForm customers={customers} />
        </div>

        <div className="max-h-96 overflow-y-scroll">
          {invoiceListItems.map((invoice) => (
            <Link
              key={invoice.id}
              href={`/sales/invoices/${invoice.id}`}
              className={
                "block border-b border-gray-50 py-3 px-4 hover:bg-gray-50"
              }
            >
              <div className="flex justify-between text-[length:14px] font-bold leading-6">
                <div>{invoice.name}</div>
                <div>{currencyFormatter.format(invoice.totalAmount)}</div>
              </div>
              <div className="flex justify-between text-[length:12px] font-medium leading-4 text-gray-400">
                <div>{invoice.number}</div>
                <div
                  className={
                    "uppercase" +
                    " " +
                    (invoice.dueStatus === "paid"
                      ? "text-green-brand"
                      : invoice.dueStatus === "overdue"
                      ? "text-red-brand"
                      : "")
                  }
                >
                  {invoice.dueStatusDisplay}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="w-1/2">{children}</div>
    </div>
  );
}

interface InvoiceData {
  invoiceListItems: {
    totalAmount: number;
    totalDeposits: number;
    daysToDueDate: number;
    dueStatus: "paid" | "overpaid" | "overdue" | "due";
    dueStatusDisplay: string;
    id: string;
    name: string;
    number: number;
  }[];
  overdueAmount: number;
  dueSoonAmount: number;
}
