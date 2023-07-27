import Layout from '@/components/layouts'

function Home() {
  return <h1>Home Page</h1>
}

Home.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>
}

export default Home
