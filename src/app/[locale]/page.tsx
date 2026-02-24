import { setRequestLocale } from 'next-intl/server';
import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import AboutSection from '@/components/AboutSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import TestimonialsSection from '@/components/TestimonialsSection';
import InstagramSection from '@/components/InstagramSection';
import NewsletterSection from '@/components/NewsletterSection';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <AboutSection />
      <FeaturedProducts />
      <TestimonialsSection />
      <InstagramSection />
      <NewsletterSection />
    </main>
  );
}
