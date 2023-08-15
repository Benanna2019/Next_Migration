"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getUserByEmail } from "@/models/userserver";
import { createCustomer } from "@/models/customerserver";
import { revalidatePath } from "next/cache";
import {
  LineItemFields,
  createInvoice,
  findInvoiceByDepositId,
} from "@/models/invoiceserver";
import {
  parseDate,
  validateAmount,
  validateCustomerId,
  validateDepositDate,
  validateDueDate,
  validateLineItemQuantity,
  validateLineItemUnitPrice,
} from "@/utils";
import { NextResponse } from "next/server";
import invariant from "tiny-invariant";
import { redirect } from "next/navigation";
import { createDeposit, deleteDeposit } from "@/models/depositserver";

export async function addCustomer(name: string, email: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("unauthorized");
  }

  if (!session?.user?.email) {
    throw new Error(
      "please add an email to your github profile & logout out and signin again"
    );
  }

  const user = await getUserByEmail(session?.user?.email as string);

  if (!user) {
    throw new Error(
      "There is a server error and you shouldnt be getting this error"
    );
  }

  const customer = await createCustomer({
    name,
    email,
    user_email: user?.email as string,
  });
  console.log("customer", customer);
  revalidatePath("/sales/customers");
}

export async function addInvoice(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const intent = formData.get("intent");

  switch (intent) {
    case "create": {
      const customerId = formData.get("customerId");
      const dueDateString = formData.get("dueDateString");
      invariant(typeof customerId === "string", "customerId is required");
      invariant(typeof dueDateString === "string", "dueDate is required");
      const dueDate = parseDate(dueDateString);

      const lineItemIds = formData.getAll("lineItemId");
      const lineItemQuantities = formData.getAll("quantity");
      const lineItemUnitPrices = formData.getAll("unitPrice");
      const lineItemDescriptions = formData.getAll("description");
      const lineItems: Array<LineItemFields> = [];
      for (let i = 0; i < lineItemQuantities.length; i++) {
        const quantity = +lineItemQuantities[i];
        const unitPrice = +lineItemUnitPrices[i];
        const description = lineItemDescriptions[i];
        invariant(typeof quantity === "number", "quantity is required");
        invariant(typeof unitPrice === "number", "unitPrice is required");
        invariant(typeof description === "string", "description is required");

        lineItems.push({ quantity, unitPrice, description });
      }

      const errors = {
        customerId: validateCustomerId(customerId),
        dueDate: validateDueDate(dueDate),
        lineItems: lineItems.reduce((acc, lineItem, index) => {
          const id = lineItemIds[index];
          invariant(typeof id === "string", "lineItem ids are required");
          acc[id] = {
            quantity: validateLineItemQuantity(lineItem.quantity),
            unitPrice: validateLineItemUnitPrice(lineItem.unitPrice),
          };
          return acc;
        }, {} as Record<string, { quantity: null | string; unitPrice: null | string }>),
      };

      const customerIdHasError = errors.customerId !== null;
      const dueDateHasError = errors.dueDate !== null;
      const lineItemsHaveErrors = Object.values(errors.lineItems).some(
        (lineItem) => Object.values(lineItem).some(Boolean)
      );
      const hasErrors =
        dueDateHasError || customerIdHasError || lineItemsHaveErrors;

      if (hasErrors) {
        return NextResponse.json(errors, { status: 400 });
      }

      const invoice = await createInvoice({
        dueDate,
        customerId,
        lineItems,
      });
      redirect(`/sales/invoices/${invoice.id}`);
    }
  }
  throw new Error(`Unsupported intent: ${intent}`);
}

export async function removeDeposit({
  depositId,
  intent,
}: {
  depositId: string;
  intent: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  // let { intent } = await req.json();
  // const { depositId } = context.params;

  invariant(typeof depositId === "string", "params.depositId is not available");
  invariant(typeof intent === "string", "intent must be a string");

  let redirectTo;
  const associatedInvoiceId = await findInvoiceByDepositId(depositId);

  if (!associatedInvoiceId) {
    redirectTo = "/sales/invoices";
  } else {
    redirectTo = `/sales/invoices/${associatedInvoiceId.id}`;
  }

  switch (intent) {
    case "delete": {
      await deleteDeposit(depositId);
      redirect(redirectTo);
    }
    default: {
      throw new Error(`Unsupported intent: ${intent}`);
    }
  }
}

export async function addDeposit(formData: FormData, invoiceId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  const intent = formData.get("intent");

  invariant(typeof intent === "string", "intent required");

  switch (intent) {
    case "create-deposit": {
      const amount = Number(formData.get("amount"));
      const depositDateString = formData.get("depositDate");
      const note = formData.get("note");
      invariant(!Number.isNaN(amount), "amount must be a number");
      invariant(typeof depositDateString === "string", "dueDate is required");
      invariant(typeof note === "string", "dueDate is required");
      const depositDate = parseDate(depositDateString);

      const errors = {
        amount: validateAmount(amount),
        depositDate: validateDepositDate(depositDate),
      };
      const hasErrors = Object.values(errors).some(
        (errorMessage) => errorMessage
      );
      if (hasErrors) {
        return errors;
      }

      const newDeposit = await createDeposit({
        invoiceId,
        amount,
        note,
        depositDate,
      });
      console.log("new deposit data", newDeposit);
      revalidatePath("/sales/invoices/[invoiceId]");
    }
  }
}
