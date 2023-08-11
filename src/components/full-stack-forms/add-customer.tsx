"use client";
import { FilePlusIcon, inputClasses, LabelText, SpinnerIcon } from "..";
import { useRouter } from "next/navigation";
import * as z from "zod";
import * as React from "react";
import { addCustomer } from "@/app/actions";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../shadui/ui/dialog";
import { ErrorBoundaryComponent } from "../error-boundary";

const newCustomerSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  email: z.string().email().nonempty({ message: "Invalid email" }),
});

export default function BetterAddCustomerForm() {
  const [open, setOpen] = React.useState(false);
  const customerFormRef = React.useRef<any>();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <span className="flex gap-1">
          <FilePlusIcon /> <span>Add Customer</span>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Customer</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ErrorBoundaryComponent>
          <div className="relative p-10">
            <h2 className="font-display mb-4">New Customer</h2>
            <form
              action={async (formData) => {
                const customerForm = Object.fromEntries(formData.entries());
                // const name = formData.get("name") as string;
                // const email = formData.get("email") as string;
                const { name, email } = newCustomerSchema.parse(customerForm);
                customerFormRef.current.reset;

                await addCustomer(name, email);

                setOpen(false);
              }}
              ref={customerFormRef}
              className="flex flex-col gap-4"
            >
              <div>
                <label htmlFor="name">
                  <LabelText>Name</LabelText>
                </label>
                <input
                  id="name"
                  className={inputClasses}
                  type="text"
                  name="name"
                />
              </div>
              <div>
                <label htmlFor="email">
                  <LabelText>Email</LabelText>
                </label>
                <input
                  id="email"
                  className={inputClasses}
                  type="email"
                  name="email"
                />
              </div>
              <SubmitButton />
            </form>
          </div>
        </ErrorBoundaryComponent>
      </DialogContent>
    </Dialog>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      {pending ? <SpinnerIcon /> : "Submit"}
    </button>
  );
}
