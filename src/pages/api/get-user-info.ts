import { getUserByEmail } from '@/models/userserver'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).send('Unauthorized')
  }
  const user = await getUserByEmail(session?.user?.email as string)
  const data = { user }

  res.status(200).json(data)
}
