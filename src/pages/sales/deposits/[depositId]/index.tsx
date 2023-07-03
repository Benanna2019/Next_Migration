import { getDepositDetails } from '@/models/depositserver'
import invariant from 'tiny-invariant'
import { TrashIcon } from '@/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { redirect } from 'next/navigation'
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types'
import DeleteDepositForm from '@/components/forms/delete-deposit-form'
import Layout from '@/components/layouts'
import SalesNav from '@/components/sales-nav'

export default function DepositRoute({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <SalesNav>
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
      </SalesNav>
    </Layout>
  )
}

export async function getServerSideProps(
  context: GetServerSidePropsContext & { params: { depositId: string } }
) {
  const user = await getServerSession(context.req, context.res, authOptions)
  if (!user) {
    redirect('/login')
  }

  const { depositId } = context.params
  invariant(typeof depositId === 'string', 'params.depositId is not available')
  const depositDetails = await getDepositDetails(depositId)
  if (!depositDetails) {
    throw new Response('not found', { status: 404 })
  }

  const data = {
    depositNote: depositDetails.note,
    depositId,
  }

  return {
    props: {
      data,
    },
  }
}
