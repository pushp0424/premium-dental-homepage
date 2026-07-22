import { prisma } from "@/lib/db";
import { MotionRoot } from "@/components/MotionRoot";
import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { StatsBand } from "@/components/marketing/StatsBand";
import { WhyChooseUs } from "@/components/marketing/WhyChooseUs";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { DoctorsGrid } from "@/components/marketing/DoctorsGrid";
import { LocationsSection } from "@/components/marketing/LocationsSection";
import { Testimonials } from "@/components/marketing/Testimonials";
import { FAQAccordion } from "@/components/marketing/FAQAccordion";
import { CTASection } from "@/components/marketing/CTASection";
import { Footer } from "@/components/marketing/Footer";

export default async function Home() {
  const [services, doctors, locations] = await Promise.all([
    prisma.service.findMany({ orderBy: { price: "desc" }, take: 8 }),
    prisma.doctor.findMany({ orderBy: { yearsExperience: "desc" } }),
    prisma.location.findMany(),
  ]);

  return (
    <MotionRoot>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Hero />
        <StatsBand />
        <WhyChooseUs />
        <ServicesGrid services={services} />
        <DoctorsGrid doctors={doctors} />
        <LocationsSection locations={locations} />
        <Testimonials />
        <FAQAccordion />
        <CTASection />
      </main>
      <Footer />
    </MotionRoot>
  );
}
