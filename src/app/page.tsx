import { Header } from '@/components/ui/Header'
import { Hero } from '@/components/ui/Hero'
import { FeatureCard } from '@/components/ui/FeatureCard'
import { 
  BRAND_CONFIG, 
  HERO_CONFIG, 
  FEATURES_CONFIG, 
  STYLES 
} from '@/lib/constants/homePage'

export default function HomePage() {
  return (
    <div className={STYLES.background}>
      <Header {...BRAND_CONFIG} />
      
      <Hero {...HERO_CONFIG} />

      <div className={STYLES.featuresContainer}>
        {FEATURES_CONFIG.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  )
}