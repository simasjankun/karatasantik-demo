import { setRequestLocale } from 'next-intl/server';

export default async function JuvelyrikaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="font-playfair text-gold/40 tracking-[0.3em] text-sm uppercase">
        Juvelyrika — coming soon
      </p>
    </main>
  );
}
