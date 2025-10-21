interface HeroProps {
  title: string
  subtitle: string
  description: string
}

export function Hero({
  title,
  subtitle,
  description
}: HeroProps) {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center">
        <h2 className="text-7xl font-black text-gray-800 mb-6 leading-tight">
          {title}<br />
          <span className="text-gray-600">{subtitle}</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </main>
  )
}
