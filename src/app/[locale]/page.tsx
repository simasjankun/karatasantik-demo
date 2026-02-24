import { setRequestLocale } from 'next-intl/server';
import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import AboutSection from '@/components/AboutSection';

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
    </main>
  );
}
