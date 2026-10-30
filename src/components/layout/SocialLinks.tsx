import { InstagramLogoIcon, TiktokLogoIcon, type Icon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface SocialNetwork {
  name: string
  href: string
  icon: Icon
}

const socialNetworks: SocialNetwork[] = [
  { name: 'Instagram', href: 'https://www.instagram.com/demaduro', icon: InstagramLogoIcon },
  { name: 'TikTok', href: 'https://www.tiktok.com/@demaduro', icon: TiktokLogoIcon },
]

interface SocialLinksProps {
  className?: string
  linkClassName?: string
  iconSize?: number
}

export default function SocialLinks({ className, linkClassName, iconSize = 20 }: SocialLinksProps) {
  return (
    <ul className={cn('flex items-center gap-1', className)}>
      {socialNetworks.map(({ name, href, icon: SocialIcon }) => (
        <li key={name}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Demaduro en ${name}`}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              linkClassName
            )}
          >
            <SocialIcon size={iconSize} weight="regular" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  )
}
