import { fetcher } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { FullFakebooksLogo, FullUserLogo, SpinnerIcon } from '..'

export function LogoRenderer({}) {
  const { data, isLoading, isError } = useQuery(['user'], () =>
    fetcher('/api/get-user-info/')
  )

  console.log('data', data)

  console.log('fetching logo info')

  return (
    <div className="flex flex-wrap items-center gap-1">
      {isLoading ? (
        <SpinnerIcon />
      ) : data && data.user?.logoUrl ? (
        <Link href="/">
          <FullUserLogo size="lg" position="left" url={data.user.logoUrl} />
        </Link>
      ) : (
        <Link href=".">
          <FullFakebooksLogo size="sm" position="left" />
        </Link>
      )}
      {/* Fallback if there is an error user info in the db */}
      {/* {isError && (
        <Link href="/">
          <FullFakebooksLogo size="sm" position="left" />
        </Link>
      )} */}
    </div>
  )
}
