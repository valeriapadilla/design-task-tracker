interface FeatureCardProps {
  icon: string
  iconBgColor: string
  title: string
  description: string
}

export function FeatureCard({ icon, iconBgColor, title, description }: FeatureCardProps) {
  return (
    <div className="bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
      <div className="mb-4">
        <span className="text-4xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  )
}
