import { Link } from 'react-router-dom'

type ItemNavegable = { path: string; externo?: boolean }

export function navLinkProps(item: ItemNavegable) {
  return item.externo
    ? ({ component: 'a', href: item.path } as const)
    : ({ component: Link, to: item.path } as const)
}
