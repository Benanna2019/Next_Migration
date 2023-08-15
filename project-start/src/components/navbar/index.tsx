import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { UpRightArrowIcon, SpinnerIcon, FilePlusIcon } from '..'
import { SignOut } from '../login'
import { UploadCompanyLogo } from '../modal/upload-logo-dialog'
import { LogoRenderer } from '../logo-renderer'

export default function Navbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="relative flex h-screen rounded-lg bg-white text-gray-600">
      <div className="border-r border-gray-100 bg-gray-50">
        <div className="p-4">
          <LogoRenderer />
          <div className="h-7" />
          <div className="flex flex-col font-bold text-gray-800">
            <NavItem to="/dashboard" isActive={pathname === '/dashboard'}>
              Dashboard
            </NavItem>
            <NavItem to="/accounts" isActive={pathname === '/accounts'}>
              Accounts
            </NavItem>
            <NavItem to="/sales" isActive={pathname === '/salse'}>
              Sales
            </NavItem>
            <NavItem to="/expenses" isActive={pathname === '/expenses'}>
              Expenses
            </NavItem>
            <NavItem to="/reports" isActive={pathname === '/reports'}>
              Reports
            </NavItem>
            <div>
              <UploadCompanyLogo
                trigger={
                  <span className="my-1 flex gap-1 py-1 px-2 pr-6 text-[length:14px]">
                    Upload Logo
                  </span>
                }
              />
            </div>
            <a
              href="https://github.com/benanna2019/Next_Migration"
              className="my-1 flex justify-between py-1 px-2 pr-6 text-[length:14px]"
            >
              Github Repo
            </a>
            <div>
              <SignOut />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

function NavItem({
  to,
  children,
  isActive,
}: {
  to: string
  children: React.ReactNode
  isActive: boolean
}) {
  return (
    <Link
      href={to}
      className={`my-1 py-1 px-2 pr-16 text-[length:14px] ${
        isActive ? 'rounded-md bg-gray-100' : ''
      }`}
    >
      {children}
    </Link>
  )
}

function Spinner({ visible }: { visible: boolean }) {
  return (
    <SpinnerIcon
      className={clsx('animate-spin transition-opacity', {
        'opacity-0': !visible,
        'opacity-100': visible,
      })}
    />
  )
}
