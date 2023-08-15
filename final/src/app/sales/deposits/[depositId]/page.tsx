import { getDepositDetails } from "@/models/depositserver";
import invariant from "tiny-invariant";
import { TrashIcon } from "@/components";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DeleteDepositForm from "@/components/forms/delete-deposit-form";

export const dynamic = "force-dynamic";

export default async function DepositRoute({
  params,
}: {
  params: { depositId: string };
}) {
  const user = await getServerSession(authOptions);
  if (!user) {
    redirect("/login");
  }

  const { depositId } = params;
  invariant(typeof depositId === "string", "params.depositId is not available");
  const depositDetails = await getDepositDetails(depositId);
  if (!depositDetails) {
    throw new Response("not found", { status: 404 });
  }

  const data = {
    depositNote: depositDetails.note,
    depositId,
  };
  return (
    <div className="p-8">
      <div className="flex justify-between">
        {data.depositNote ? (
          <span>
            Note:
            <br />
            <span className="pl-1">{data.depositNote}</span>
          </span>
        ) : (
          <span className="text-m-p-sm md:text-d-p-sm uppercase text-gray-500">
            No note
          </span>
        )}
        <div>
          <DeleteDepositForm depositId={data.depositId} />
        </div>
      </div>
    </div>
  );
}
