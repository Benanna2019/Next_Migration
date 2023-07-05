import { fetcher } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { FullFakebooksLogo, FullUserLogo, SpinnerIcon } from '..'

export function LogoRenderer({}) {
  const { data, isLoading, isError } = useQuery(['user'], () =>
    fetcher('/api/get-user-info/')
  )

  return (
    <div className="flex flex-wrap items-center gap-1">
      {isLoading && <SpinnerIcon />}
      {data && data.user.email && (
        <FullUserLogo size="lg" position="left" url={data.user.logoUrl} />
      )}
      {/* Fallback if there is no user info in the db */}
      {isError ||
        (data?.length === 0 && (
          <Link href=".">
            <FullFakebooksLogo size="sm" position="left" />
          </Link>
        ))}
    </div>
  )
}
