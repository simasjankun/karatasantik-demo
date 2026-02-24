export type NavChild = {
  labelKey: string;
  href: string;
};

export type NavItem = {
  labelKey: string;
  href: string;
  children?: NavChild[];
};

export const navigation: NavItem[] = [
  {
    labelKey: 'juvelyrika',
    href: '/juvelyrika',
    children: [
      { labelKey: 'auksiniai_ziedai', href: '/juvelyrika/auksiniai-ziedai' },
      { labelKey: 'suzadetuvin_ziedai', href: '/juvelyrika/suzadetuvin-ziedai' },
      { labelKey: 'auksiniai_auskarai', href: '/juvelyrika/auksiniai-auskarai' },
      { labelKey: 'auksiners_sages', href: '/juvelyrika/auksiners-sages' },
      { labelKey: 'grandineles_ir_pakabukai', href: '/juvelyrika/grandineles-ir-pakabukai' },
      { labelKey: 'sidabriniai_dirbiniai', href: '/juvelyrika/sidabriniai-dirbiniai' },
    ],
  },
  {
    labelKey: 'antikvariatas',
    href: '/antikvariatas',
    children: [
      { labelKey: 'antikvariniai_laikrodziai', href: '/antikvariatas/antikvariniai-laikrodziai' },
      { labelKey: 'sidabriniai_indai', href: '/antikvariatas/sidabriniai-indai' },
      { labelKey: 'veidroziai_ir_remai', href: '/antikvariatas/veidroziai-ir-remai' },
    ],
  },
  { labelKey: 'akcijos', href: '/akcijos' },
  { labelKey: 'dovanuKuponai', href: '/dovanu-kuponai' },
  { labelKey: 'apieMus', href: '/apie-mus' },
  { labelKey: 'kontaktai', href: '/kontaktai' },
];
