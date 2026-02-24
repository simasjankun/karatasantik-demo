import { setRequestLocale } from 'next-intl/server';

export default async function DovanuKuponaiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="font-playfair text-gold/40 tracking-[0.3em] text-sm uppercase">
        Dovanų kuponai — coming soon
      </p>
    </main>
  );
}
