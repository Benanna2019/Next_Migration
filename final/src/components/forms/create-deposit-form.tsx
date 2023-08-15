"use client";
import { LabelText, inputClasses, submitButtonClasses } from "..";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

const createDepositSchema = z.object({
  formAmount: z.string(),
  formDepositDate: z.string(),
  invoiceId: z.string(),
  formNote: z.string(),
  intent: z.string(),
});

type CreateDepositFormData = z.infer<typeof createDepositSchema>;

export default function CreateDepositForm({ data }: { data: any }) {
  const [fetchingError, setFetchingError] = React.useState<any>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDepositFormData>({
    resolver: zodResolver(createDepositSchema),
  });

  const router = useRouter();

  const { mutateAsync, error, isError } = useMutation({
    mutationFn: (formData: any) => {
      return fetch("/api/deposits", {
        method: "POST",
        body: JSON.stringify(formData),
      });
    },
  });

  async function _createDepositAction(data: CreateDepositFormData) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const result = await mutateAsync(data);
    const newDeposit = await result.json();
    if (newDeposit.status !== 200) {
      setFetchingError(error);
    }
    reset();
    router.push(`/sales/invoices/${data.invoiceId}`);
  }

  return (
    <form
      onSubmit={handleSubmit(_createDepositAction)}
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
          {...register("formAmount")}
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
          {...register("formDepositDate")}
          type="date"
          className={`${inputClasses} h-[34px]`}
          required
        />
        {errors.formDepositDate && (
          <p className="text-red-500">{errors.formDepositDate.message}</p>
        )}
        <label htmlFor="invoiceId" className="sr-only" />
        <input
          id="invoiceId"
          {...register("invoiceId")}
          type="hidden"
          value={data.invoiceId}
        />
        {errors.invoiceId && (
          <p className="text-red-500">{errors.invoiceId.message}</p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:col-span-2 lg:flex">
        <div className="flex-1">
          <LabelText>
            <label htmlFor="depositNote">Note</label>
          </LabelText>
          <input
            id="depositNote"
            {...register("formNote")}
            type="text"
            className={inputClasses}
          />
          {errors.formNote && (
            <p className="text-red-500">{errors.formNote.message}</p>
          )}
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className={submitButtonClasses}
            {...register("intent")}
            value="create-deposit"
          >
            Create
          </button>
        </div>
        {isError && <p>{fetchingError}</p>}
      </div>
    </form>
  );
}
