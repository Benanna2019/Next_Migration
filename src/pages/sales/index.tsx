import { useSession } from 'next-auth/react'
import SalesNav from '@/components/sales-nav'
import { getFirstCustomer } from '@/models/customerserver'
import { getFirstInvoice } from '@/models/invoiceserver'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types'
import Layout from '@/components/layouts'

export default function SalesLayout({
  children,
  data,
}: {
  children: React.ReactNode
  data: InferGetServerSidePropsType<typeof getServerSideProps>
}) {
  const session = useSession()
  //   if (!session) {
  //     redirect('/login')
  //   }

  return (
    <Layout>
      <SalesNav>{children}</SalesNav>
    </Layout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  const [firstInvoice, firstCustomer] = await Promise.all([
    getFirstInvoice(),
    getFirstCustomer(),
  ])
  const data = {
    firstInvoiceId: firstInvoice?.id,
    firstCustomerId: firstCustomer?.id,
  }
  return {
    props: {
      data,
    },
  }
}
