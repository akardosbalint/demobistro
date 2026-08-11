export const siteConfig = {
  name: "Zöld Sarok",
  fullName: "Zöld Sarok Vegan Bistro",
  tagline: "Növényi konyha, őszinte ízek",
  description:
    "Prémium növényi alapú bistro a belváros szívében — szezonális alapanyagok, kézműves fogások, meleg atmoszféra.",
  address: "1053 Budapest, Kossuth Lajos utca 12.",
  phone: "+36 1 234 5678",
  email: "asztal@zoldsarok.hu",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2694.9!2d19.0567!3d47.4979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDI5JzUyLjQiTiAxOcKwMDMnMjQuMSJF!5e0!3m2!1shu!2shu",
  hours: [
    { day: "Hétfő", hours: "Zárva" },
    { day: "Kedd – Csütörtök", hours: "12:00 – 22:00" },
    { day: "Péntek – Szombat", hours: "12:00 – 23:00" },
    { day: "Vasárnap", hours: "12:00 – 21:00" },
  ],
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
  },
  bookingSettings: {
    slotIntervalMinutes: 30,
    maxPartySize: 12,
    minPartySize: 1,
    openTime: "12:00",
    closeTime: "22:00",
    lastSeatingOffsetMinutes: 90,
  },
} as const;

export const dietaryLabels: Record<string, string> = {
  vegan: "Vegán",
  "gluten-free": "Gluténmentes",
  "nut-free": "Diómentes",
  seasonal: "Szezonális",
};

export const tableTypeLabels: Record<string, string> = {
  standard: "Belső terem",
  window: "Ablak melletti",
  terrace: "Terasz",
  bar: "Bár pult",
  private: "Különterem",
};

export const bookingStatusLabels: Record<string, string> = {
  confirmed: "Visszaigazolva",
  "checked-in": "Bejelentkezve",
  "no-show": "Nem jelent meg",
  cancelled: "Lemondva",
};
