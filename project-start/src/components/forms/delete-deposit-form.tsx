import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { TrashIcon } from '..'

const deleteDepositSchema = z.object({
  depositId: z.string(),
  intent: z.string(),
})

type DeleteDepositFormData = z.infer<typeof deleteDepositSchema>

export default function DeleteDepositForm({
  depositId,
}: {
  depositId: string
}) {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteDepositFormData>({
    resolver: zodResolver(deleteDepositSchema),
  })
  const router = useRouter()

  async function _deleteDepositAction(data: DeleteDepositFormData) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    setLoading(true)
    const response = await fetch('/api/delete-deposit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const result = await response.json()
    if (result.status !== 200) {
      setError(null)
    }
    router.push(result)
  }

  return (
    <form onSubmit={handleSubmit(_deleteDepositAction)}>
      <input
        title="Delete deposit"
        value="delete"
        {...register('intent')}
        hidden
      />
      <input
        type="hidden"
        value={depositId as string}
        {...register('depositId')}
      />
      <button type="submit">
        <TrashIcon />
      </button>
    </form>
  )
}
