export type SocialLinks = {
  facebook: string;
  instagram: string;
};

export type ContactInfo = {
  phone: string;
  email: string;
  address: string;
  social: SocialLinks;
};

export const contact: ContactInfo = {
  phone: '+370 000 0000',
  email: 'info@karatasantik.lt',
  address: 'Vilnius, Lietuva',
  social: {
    facebook: '#',
    instagram: '#',
  },
};
