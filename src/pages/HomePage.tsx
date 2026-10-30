import PageLayout from '../components/layout/PageLayout'
import HeroSection from '../components/home/HeroSection'
import ProductMarquee from '../components/home/ProductMarquee'
import MenuSection from '../components/home/MenuSection'
import SedesSection from '../components/home/SedesSection'
import ValuesSection from '../components/home/ValuesSection'
import CTASection from '../components/home/CTASection'

export default function HomePage() {
  return (
    <PageLayout>
      <HeroSection />
      <ProductMarquee />
      <MenuSection />
      <SedesSection />
      <ValuesSection />
      <CTASection />
    </PageLayout>
  )
}
