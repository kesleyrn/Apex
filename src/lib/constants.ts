export const BUSINESS = {
  name: "Apex Furnishing Rwanda",
  company: "Apex Ventures Limited",
  tagline: "A Touch of Class",
  address: "Ave KN2, Nyarugenge, Shop D49, Ground Floor, CHIC Complex, Kigali, Rwanda",
  phoneDisplay: "+250 788 442 521",
  phoneTel: "+250788442521",
  whatsappNumber: "250788442521", // digits only, as wa.me requires
  email: "apexrwa@gmail.com",
  instagram: { handle: "apex_furnishing_rwanda", url: "https://www.instagram.com/apex_furnishing_rwanda/" },
  facebook: { name: "Apex Furnishing Rwanda", url: "https://www.facebook.com/search/top?q=Apex%20Furnishing%20Rwanda" }, // TODO: replace with the exact page URL
  hours: { days: "Daily", open: "10:00 AM", close: "08:00 PM" },
} as const;

export const PAGE_SIZE = 12;
export const HOME_NEW_ARRIVALS_COUNT = 8;

export const DEFAULT_CATEGORIES = [
  "Bedsheets",
  "Pillows",
  "Duvets",
  "Towels",
  "Décor",
  "Robes",
  "Bed Covers",
] as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Shop", href: "/shop" },
  { label: "Contact Us", href: "/contact" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

/** Drop a bedroom photo here (public/images/hero-bedroom.jpg). Without it the hero shows a dark gradient. */
export const HERO_IMAGE = "/images/hero-bedroom.jpg";

export const ABOUT_IMAGE = "/images/about-bedroom.jpg";
export const CONTACT_IMAGE = "/images/contact-hero.jpg";
export const MAP_QUERY = "CHIC Complex, Kigali, Rwanda";
