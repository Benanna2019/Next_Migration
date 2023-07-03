import { getCustomerListItems } from '@/models/customerserver'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import CustomerLayout from '@/components/customer-layout'
import { redirect } from 'next/navigation'
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types'
import SalesNav from '@/components/sales-nav'
import Layout from '@/components/layouts'

export default function CustomersLayout({
  children,
  customers,
}: {
  children: React.ReactNode
  customers: InferGetServerSidePropsType<typeof getServerSideProps>['customers']
}) {
  return (
    <Layout>
      <SalesNav>
        <CustomerLayout customers={customers}>{children}</CustomerLayout>
      </SalesNav>
    </Layout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getServerSession(context.req, context.res, authOptions)
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  const customers = await getCustomerListItems()
  return {
    props: {
      customers,
    },
  }
}
