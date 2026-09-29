import React from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingHero } from '../components/landing/LandingHero';
import { FeatureSection } from '../components/landing/FeatureSection';
import { AnnotationShowcase } from '../components/landing/AnnotationShowcase';
import { BeforeAfterSection } from '../components/landing/BeforeAfterSection';
import { ProductPreview } from '../components/landing/ProductPreview';
import { TestimonialSection } from '../components/landing/TestimonialSection';
import { CTASection } from '../components/landing/CTASection';
import { LandingFooter } from '../components/landing/LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090D16] text-white selection:bg-brand-500 selection:text-white font-sans overflow-x-hidden">
      {/* 1. Navbar */}
      <LandingNavbar />

      {/* 2. Hero Section & Interactive Hero Demo */}
      <LandingHero />

      {/* 3. Feature Section: From Screenshot to Actionable Bug */}
      <FeatureSection />

      {/* 4. Visual Annotation Showcase: Point. Don't Explain. */}
      <AnnotationShowcase />

      {/* 5. Before / After Comparison */}
      <BeforeAfterSection />

      {/* 6. Product Preview Window */}
      <ProductPreview />

      {/* 7. Minimal Testimonial Section */}
      <TestimonialSection />

      {/* 8. Final CTA Section */}
      <CTASection />

      {/* 9. Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
