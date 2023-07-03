import { getCustomerListItems } from '@/models/customerserver'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { redirect } from 'next/navigation'
import CustomerIdPage from '@/components/customer-id-page'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import CustomerLayout from '@/components/customer-layout'
import Layout from '@/components/layouts'
import SalesNav from '@/components/sales-nav'
import { useQuery } from '@tanstack/react-query'

const fetcher = (url: string) => fetch(url).then((res) => res.json())
export default function CustomerIdLayout({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const customerId = router.query.customerId

  const customerData = useQuery(['customer', customerId], () =>
    fetcher(`/api/get-customer/${customerId}`)
  )

  return (
    <Layout>
      <SalesNav>
        <CustomerLayout customers={data.customers}>
          <CustomerIdPage customerData={customerData} />
        </CustomerLayout>
      </SalesNav>
    </Layout>
  )
}

export async function getServerSideProps(
  context: GetServerSidePropsContext & { params: { customerId: string } }
) {
  const user = await getServerSession(context.req, context.res, authOptions)
  if (!user) {
    redirect('/login')
  }
  const customers = await getCustomerListItems()

  const data = { customers }
  return {
    props: {
      data,
    },
  }
}
