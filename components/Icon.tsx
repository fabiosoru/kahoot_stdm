import React from 'react'
import * as Icons from 'lucide-react'

interface IconProps {
  name: keyof typeof Icons
  size?: number
  className?: string
  strokeWidth?: number
}

export function Icon({ name, size = 20, className = '', strokeWidth = 2 }: IconProps) {
  const IconComponent = Icons[name] as React.ComponentType<any>

  if (!IconComponent) {
    return null
  }

  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      className={className}
    />
  )
}

// Preset icons pour usage courant
export const IconSet = {
  Home: (props: any) => <Icons.Home {...props} />,
  Settings: (props: any) => <Icons.Settings {...props} />,
  LogOut: (props: any) => <Icons.LogOut {...props} />,
  Plus: (props: any) => <Icons.Plus {...props} />,
  Edit: (props: any) => <Icons.Edit {...props} />,
  Trash2: (props: any) => <Icons.Trash2 {...props} />,
  Save: (props: any) => <Icons.Save {...props} />,
  X: (props: any) => <Icons.X {...props} />,
  Check: (props: any) => <Icons.Check {...props} />,
  AlertCircle: (props: any) => <Icons.AlertCircle {...props} />,
  Info: (props: any) => <Icons.Info {...props} />,
  Users: (props: any) => <Icons.Users {...props} />,
  BarChart3: (props: any) => <Icons.BarChart3 {...props} />,
  Clock: (props: any) => <Icons.Clock {...props} />,
  Award: (props: any) => <Icons.Award {...props} />,
  TrendingUp: (props: any) => <Icons.TrendingUp {...props} />,
  Share2: (props: any) => <Icons.Share2 {...props} />,
  ChevronRight: (props: any) => <Icons.ChevronRight {...props} />,
  ChevronDown: (props: any) => <Icons.ChevronDown {...props} />,
  Menu: (props: any) => <Icons.Menu {...props} />,
  Eye: (props: any) => <Icons.Eye {...props} />,
  EyeOff: (props: any) => <Icons.EyeOff {...props} />,
  Copy: (props: any) => <Icons.Copy {...props} />,
  ExternalLink: (props: any) => <Icons.ExternalLink {...props} />,
}
