import { setRequestLocale } from 'next-intl/server';

export default async function AkcijosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="font-playfair text-gold/40 tracking-[0.3em] text-sm uppercase">
        Akcijos ir nuolaidos — coming soon
      </p>
    </main>
  );
}
