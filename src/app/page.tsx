import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import ServiceArea from '@/components/sections/ServiceArea'
import ImpactStats from '@/components/sections/ImpactStats'
import ScheduleServices from '@/components/sections/ScheduleServices'
import WasteWizard from '@/components/sections/WasteWizard'
import SustainabilityCalculator from '@/components/sections/SustainabilityCalculator'
import LiveTracking from '@/components/sections/LiveTracking'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {/* Gold section divider */}
        <div className="gold-divider" />

        <ServiceArea />
        <div className="gold-divider" />

        <ImpactStats />
        <div className="gold-divider" />

        <ScheduleServices />
        <div className="gold-divider" />

        <WasteWizard />
        <div className="gold-divider" />

        <SustainabilityCalculator />
        <div className="gold-divider" />

        <LiveTracking />
        <div className="gold-divider" />
      </main>
      <Footer />
    </>
  )
}
