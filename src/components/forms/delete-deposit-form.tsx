"use client";
import React from "react";
import * as z from "zod";
import { SpinnerIcon, TrashIcon } from "..";
import { removeDeposit } from "@/app/actions";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

const deleteDepositSchema = z.object({
  intent: z.string(),
});

export default function DeleteDepositForm({
  depositId,
}: {
  depositId: string;
}) {
  return (
    <form
      action={async (formData) => {
        const intentFromForm = Object.fromEntries(formData.entries());
        const { intent } = deleteDepositSchema.parse(intentFromForm);
        await removeDeposit({ depositId, intent });
      }}
    >
      <input
        title="Delete deposit"
        value="delete"
        readOnly
        name="intent"
        hidden
      />
      <DeleteDepositButton />
    </form>
  );
}

function DeleteDepositButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      {pending ? <SpinnerIcon /> : <TrashIcon />}
    </button>
  );
}
