"use client";
import { currencyFormatter, parseDate } from "../../utils";
import Link from "next/link";
import * as z from "zod";
import { LabelText, inputClasses, submitButtonClasses, SpinnerIcon } from "..";
import { addDeposit } from "@/app/actions";
import { useRef, experimental_useOptimistic as useOptimistic } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import invariant from "tiny-invariant";

interface DepositFormControlsCollection extends HTMLFormControlsCollection {
  amount?: HTMLInputElement;
  depositDate?: HTMLInputElement;
  note?: HTMLInputElement;
  intent?: HTMLButtonElement;
}

interface DepositData {
  deposits: {
    id: string;
    amount: number;
    depositDateFormatted: string;
  }[];
  invoiceId: string;
}

const lineItemClassName =
  "flex justify-between border-t border-gray-100 py-4 text-[14px] leading-[24px]";

export function Deposits({ data }: { data: DepositData }) {
  const [optimisticDeposits, addOptimisticDeposits] = useOptimistic(
    data.deposits,
    (
      state: DepositData["deposits"],
      newDeposit: DepositData["deposits"][number]
    ) => [...state, newDeposit]
  );
  const formRef = useRef<any>();
  // this is purely for helping the user have a better experience.

  console.log("optimisticDeposits", optimisticDeposits);
  return (
    <div>
      <div className="font-bold leading-8">Deposits</div>
      {optimisticDeposits.length > 0 ? (
        optimisticDeposits.map((deposit) => (
          <div key={deposit.id} className={lineItemClassName}>
            <Link
              href={`/sales/deposits/${deposit.id}`}
              className="text-blue-600 underline"
            >
              {deposit.depositDateFormatted}
            </Link>
            <div>{currencyFormatter.format(deposit.amount)}</div>
          </div>
        ))
      ) : (
        <div>None yet</div>
      )}
      <form
        action={async (formData) => {
          const amount = Number(formData.get("amount"));
          const depositDateString = formData.get("depositDate");

          invariant(
            typeof depositDateString === "string",
            "dueDate is required"
          );
          const depositDate = parseDate(depositDateString);
          const newDeposit = {
            id: "new",
            amount,
            depositDateFormatted: depositDate.toLocaleDateString(),
          };
          addOptimisticDeposits(newDeposit);
          formRef.current.reset();
          await addDeposit(formData, data.invoiceId);
        }}
        ref={formRef}
        className="grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-2"
      >
        <div className="min-w-[100px]">
          <div className="flex flex-wrap items-center gap-1">
            <LabelText>
              <label htmlFor="depositAmount">Amount</label>
            </LabelText>
          </div>
          <input
            id="depositAmount"
            name="amount"
            type="number"
            className={inputClasses}
            min="0.01"
            step="any"
            required
          />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-1">
            <LabelText>
              <label htmlFor="depositDate">Date</label>
            </LabelText>
          </div>
          <input
            id="depositDate"
            name="depositDate"
            type="date"
            className={`${inputClasses} h-[34px]`}
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:col-span-2 lg:flex">
          <div className="flex-1">
            <LabelText>
              <label htmlFor="depositNote">Note</label>
            </LabelText>
            <input
              id="depositNote"
              name="note"
              type="text"
              className={inputClasses}
            />
          </div>
          <div className="flex items-end">
            <CreateDepositButton />
          </div>
        </div>
      </form>
    </div>
  );
}

export function LineItemDisplay({
  description,
  quantity,
  unitPrice,
}: {
  description: string;
  quantity: number;
  unitPrice: number;
}) {
  return (
    <div className={lineItemClassName}>
      <div>{description}</div>
      {quantity === 1 ? null : <div className="text-[10px]">({quantity}x)</div>}
      <div>{currencyFormatter.format(unitPrice)}</div>
    </div>
  );
}

function CreateDepositButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      type="submit"
      name="intent"
      value="create-deposit"
      className={submitButtonClasses}
    >
      {pending ? <SpinnerIcon /> : "Create"}
    </button>
  );
}
