import PageLayout from '../components/layout/PageLayout'
import SedesSection from '../components/home/SedesSection'

export default function SedesPage() {
  return (
    <PageLayout>
      {/* pt-16: espacio del Navbar fijo */}
      <div className="pt-16">
        <SedesSection />
      </div>
    </PageLayout>
  )
}
