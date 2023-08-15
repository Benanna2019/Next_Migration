"use client";
import { useId, useRef, useState } from "react";
import {
  inputClasses,
  LabelText,
  PlusIcon,
  MinusIcon,
  submitButtonClasses,
  FilePlusIcon,
} from "@/components";
import { Customer } from "@/models/customerserver";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../shadui/ui/dialog";
import { addInvoice } from "@/app/actions";
import { ErrorBoundaryComponent } from "../error-boundary";

const generateRandomId = () => Math.random().toString(32).slice(2);

export const createInvoiceSchema = z.object({
  customerId: z.string(),
  invoiceDueDate: z.string(),
  invoiceLineItems: z.array(
    z.object({
      lineItemId: z.string(),
      description: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
    })
  ),
  intent: z.string(),
});

export default function CreateInvoiceForm({
  customers,
}: {
  customers: Pick<Customer, "id" | "name" | "email">[];
}) {
  const [open, setOpen] = useState<boolean>(false);
  const invoiceFormRef = useRef<any>();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <span className="flex gap-1">
          <FilePlusIcon /> <span>Add Invoice</span>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ErrorBoundaryComponent>
          <div className="relative p-10">
            <h2 className="font-display mb-4">New Invoice</h2>
            <form
              action={async (formData) => {
                invoiceFormRef.current.reset;
                await addInvoice(formData);

                setOpen(false);
              }}
              ref={invoiceFormRef}
              className="flex flex-col gap-4"
            >
              {/* <CustomerCombobox error={actionData?.errors.customerId} /> */}
              <div className="relative">
                <div className="flex flex-wrap items-center gap-1">
                  <label htmlFor="customers">
                    <LabelText>Customer</LabelText>
                  </label>
                  <select name="customerId" id="customerId">
                    {customers?.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Replace all bracketed content with the combobox once that's figured out */}
              <div>
                <div className="flex flex-wrap items-center gap-1">
                  <label htmlFor="dueDate">
                    <LabelText>Due Date</LabelText>
                  </label>
                </div>
                <input
                  id="dueDate"
                  name="dueDateString"
                  className={inputClasses}
                  type="date"
                  required
                />
              </div>
              <LineItems />
              <div>
                <button
                  type="submit"
                  name="intent"
                  value="create"
                  className={submitButtonClasses}
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </ErrorBoundaryComponent>
      </DialogContent>
    </Dialog>
  );
}

function LineItems() {
  const firstId = useId();
  const [lineItems, setLineItems] = useState(() => [firstId]);
  return (
    <div className="flex flex-col gap-2">
      {lineItems.map((lineItemClientId, index) => (
        <LineItemFormFields
          key={lineItemClientId}
          lineItemClientId={lineItemClientId}
          index={index}
          onRemoveClick={() => {
            setLineItems((lis) =>
              lis.filter((id, i) => id !== lineItemClientId)
            );
          }}
        />
      ))}
      <div className="mt-3 text-right">
        <button
          title="Add Line Item"
          type="button"
          onClick={() => setLineItems((lis) => [...lis, generateRandomId()])}
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}

function LineItemFormFields({
  lineItemClientId,
  index,
  onRemoveClick,
}: {
  lineItemClientId: string;
  index: number;
  onRemoveClick: () => void;
}) {
  return (
    <fieldset key={lineItemClientId} className="border-b-2 py-2">
      <div className="flex gap-2">
        <button type="button" title="Remove Line Item" onClick={onRemoveClick}>
          <MinusIcon />
        </button>
        <legend>Line Item {index + 1}</legend>
      </div>
      <input value={lineItemClientId} name="lineItemId" type="hidden" />
      <div className="flex flex-col gap-1">
        <div className="flex w-full gap-2">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-1">
              <LabelText>
                <label htmlFor={`quantity-${lineItemClientId}`}>
                  Quantity:
                </label>
              </LabelText>
            </div>
            <input
              id={`quantity-${lineItemClientId}`}
              name="quantity"
              type="number"
              className={inputClasses}
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-1">
              <LabelText>
                <label htmlFor={`unitPrice-${lineItemClientId}`}>
                  Unit Price:
                </label>
              </LabelText>
            </div>
            <input
              id={`unitPrice-${lineItemClientId}`}
              name="unitPrice"
              type="number"
              min="1"
              step="any"
              className={inputClasses}
            />
          </div>
        </div>
        <div>
          <LabelText>
            <label htmlFor={`description-${lineItemClientId}`}>
              Description:
            </label>
          </LabelText>
          <input
            id={`description-${lineItemClientId}`}
            name="description"
            className={inputClasses}
          />
        </div>
      </div>
    </fieldset>
  );
}
