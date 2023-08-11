"use client";
import { useState, useId } from "react";
import {
  inputClasses,
  LabelText,
  PlusIcon,
  MinusIcon,
  submitButtonClasses,
} from "@/components";
// import { CustomerCombobox } from "@/app/resources/customers";
import { Customer } from "@/models/customerserver";
import { useQuery } from "@tanstack/react-query";
import {
  useForm,
  FormProvider,
  useFormContext,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

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

export type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CreateInvoiceForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const methods = useForm<CreateInvoiceFormData>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      invoiceLineItems: [
        {
          lineItemId: generateRandomId(),
          description: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { data, isLoading, isError } = useQuery(["customers"], () =>
    fetcher("/api/customers")
  );

  const router = useRouter();

  async function _createInvoiceAction(data: CreateInvoiceFormData) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    setLoading(true);
    const response = await fetch("/api/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("result", result);
    if (result.status !== 200) {
      setError(null);
    }
    router.push(`/sales/invoices/${result}`);
  }

  return (
    <FormProvider {...methods}>
      <div className="relative p-10">
        <h2 className="font-display mb-4">New Invoice</h2>
        <form
          onSubmit={handleSubmit(_createInvoiceAction)}
          className="flex flex-col gap-4"
        >
          {/* <CustomerCombobox error={actionData?.errors.customerId} /> */}
          <div className="relative">
            <div className="flex flex-wrap items-center gap-1">
              <label htmlFor="customers">
                <LabelText>Customer</LabelText>
              </label>
              {isLoading && <span>Loading...</span>}
              {data && (
                <select {...register("customerId")} id="customerId">
                  {data?.customers?.map((customer: Customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              )}
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
              {...register("invoiceDueDate")}
              className={inputClasses}
              type="date"
              required
            />
          </div>
          <LineItems />
          <div>
            <button
              type="submit"
              {...register("intent")}
              value="create"
              className={submitButtonClasses}
            >
              Create Invoice
            </button>
            {errors.intent && (
              <span className="text-red-600">{errors.intent.message}</span>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}

function LineItems() {
  const data = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: data.control,
    name: "invoiceLineItems",
  });
  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, index) => (
        <LineItemFormFields
          key={field.id}
          lineItemClientId={field.id}
          index={index}
          onRemoveClick={() => remove(index)}
        />
      ))}
      <div className="mt-3 text-right">
        <button
          title="Add Line Item"
          type="button"
          onClick={() =>
            append({
              lineItems: [
                {
                  lineItemId: generateRandomId(),
                  quantity: 1,
                  unitPrice: 0,
                  description: "your new item added",
                },
              ],
            })
          }
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
  const data = useFormContext();

  return (
    <fieldset key={lineItemClientId} className="border-b-2 py-2">
      <div className="flex gap-2">
        <button type="button" title="Remove Line Item" onClick={onRemoveClick}>
          <MinusIcon />
        </button>
        <legend>Line Item {index + 1}</legend>
      </div>
      <input
        value={lineItemClientId}
        {...data.register(`invoiceLineItems.${index}.lineItemId`)}
        type="hidden"
      />

      <div className="flex flex-col gap-1">
        <div className="flex w-full gap-2">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-1">
              <LabelText>
                <label htmlFor={`quantity-${lineItemClientId}`}>
                  Quantity:
                </label>
              </LabelText>
              {/* {errors?.quantity ? (
                <em id="quantity-error" className="text-d-p-xs text-red-600">
                  {errors.quantity}
                </em>
              ) : null} */}
            </div>
            <input
              id={`quantity-${lineItemClientId}`}
              {...data.register(`invoiceLineItems.${index}.quantity`, {
                valueAsNumber: true,
              })}
              type="number"
              className={inputClasses}
              //   aria-invalid={Boolean(errors?.quantity) || undefined}
              //   aria-errormessage={errors?.quantity ? 'name-error' : undefined}
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-1">
              <LabelText>
                <label htmlFor={`unitPrice-${lineItemClientId}`}>
                  Unit Price:
                </label>
              </LabelText>
              {/* {data.formState.errors?.unitPrice ? (
                <em id="unitPrice-error" className="text-d-p-xs text-red-600">
                  {data.formState.errors.unitPrice}
                </em>
              ) : null} */}
            </div>
            <input
              id={`unitPrice-${lineItemClientId}`}
              {...data.register(`invoiceLineItems.${index}.unitPrice`, {
                valueAsNumber: true,
              })}
              type="number"
              min="1"
              step="any"
              className={inputClasses}
              aria-invalid={
                Boolean(data.formState.errors?.unitPrice) || undefined
              }
              aria-errormessage={
                data.formState.errors?.unitPrice ? "name-error" : undefined
              }
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
            {...data.register(`invoiceLineItems.${index}.description`)}
            className={inputClasses}
          />
        </div>
      </div>
    </fieldset>
  );
}
