export type NavChild = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export const navigation: NavItem[] = [
  {
    label: 'Juvelyrika',
    href: '/juvelyrika',
    children: [
      { label: 'Auksiniai žiedai', href: '/juvelyrika/auksiniai-ziedai' },
      { label: 'Sužadėtuvių žiedai', href: '/juvelyrika/suzadetuvin-ziedai' },
      { label: 'Auksiniai auskarai', href: '/juvelyrika/auksiniai-auskarai' },
      { label: 'Auksinės sagės', href: '/juvelyrika/auksiners-sages' },
      { label: 'Grandinėlės ir pakabukai', href: '/juvelyrika/grandineles-ir-pakabukai' },
      { label: 'Sidabriniai dirbiniai', href: '/juvelyrika/sidabriniai-dirbiniai' },
    ],
  },
  {
    label: 'Antikvariatas',
    href: '/antikvariatas',
    children: [
      { label: 'Antikvariniai laikrodžiai', href: '/antikvariatas/antikvariniai-laikrodziai' },
      { label: 'Sidabriniai indai ir stalo įrankiai', href: '/antikvariatas/sidabriniai-indai' },
      { label: 'Veidrodžiai ir rėmai', href: '/antikvariatas/veidrodžiai-ir-remai' },
    ],
  },
  { label: 'Akcijos ir nuolaidos', href: '/akcijos' },
  { label: 'Dovanų kuponai', href: '/dovanu-kuponai' },
  { label: 'Apie mus', href: '/apie-mus' },
  { label: 'Kontaktai', href: '/kontaktai' },
];
