import React from 'react'
import Link from 'next/link'

const links = [
  { href: '/', label: 'caffellattewebsite' }
].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`
  return link
})

const Navigation = () => (
  <nav>
    <ul>
      <li>
        <Link prefetch href="/">
          <a>home</a>
        </Link>
      </li>
      <ul>
        {links.map(({ key, href, label }) => (
          <li key={key}>
            <Link href={href}>
              <a>{label}</a>
            </Link>
          </li>
        ))}
      </ul>
    </ul>
  </nav>
)

export default Navigation
