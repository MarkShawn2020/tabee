// tabee-logo.tsx
'use client'

export const Logo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* 主体T型结构 */}
    <path
      d="M32 12L32 52M20 20L44 20"
      stroke="url(#gradient)"
      strokeWidth="6"
      strokeLinecap="round"
    />

    {/* 动态连接点 */}
    <circle cx="32" cy="36" r="3" fill="currentColor" className="text-blue-500" />
    
    {/* 流动线条 */}
    <path
      d="M18 44C22 40 26 38 32 36C38 34 42 32 46 28"
      stroke="currentColor"
      strokeWidth="2"
      className="text-purple-400"
      strokeLinecap="round"
      opacity="0.75"
    />

    <defs>
      <linearGradient
        id="gradient"
        x1="32"
        y1="12"
        x2="32"
        y2="52"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
  </svg>
)
