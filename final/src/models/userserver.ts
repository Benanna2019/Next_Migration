import prisma from '../utils/dbserver'

import type { User } from '@prisma/client'

export type { User }

export async function getUserById(id: User['id']) {
  return prisma.user.findUnique({ where: { id } })
}

export async function getUserByEmail(email: User['email']) {
  return prisma.user.findUnique({ where: { email: email as string } })
}

export async function updateUser({
  id,
  logoUrl,
}: {
  id: User['id']
  logoUrl: User['logoUrl']
}) {
  return prisma.user.update({
    where: { id },
    data: {
      logoUrl,
    },
  })
}

export async function deleteUserById(id: User['id']) {
  return prisma.user.delete({ where: { id } })
}

// export async function verifyLogin(
//   email: User['email'],
//   password: Password['hash']
// ) {
//   const userWithPassword = await prisma.user.findUnique({
//     where: { email },
//     include: {
//       password: true,
//     },
//   })

//   if (!userWithPassword || !userWithPassword.password) {
//     return null
//   }

//   const isValid = await bcrypt.compare(password, userWithPassword.password.hash)

//   if (!isValid) {
//     return null
//   }

//   const { password: _password, ...userWithoutPassword } = userWithPassword

//   return userWithoutPassword
// }
