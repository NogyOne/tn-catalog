import type { MenuLink, MenuLinkWithIcon } from "../types/menusLinks";
import Facebook from "@components/icons/astro/Facebook.astro";
import Instagram from "@components/icons/astro/Instagram.astro";
import Tiktok from "@components/icons/astro/Tiktok.astro";

export const MAIN_MENU: MenuLink[] = [
  { name: "Inicio", href: "/" },
  { name: "Catálogo", href: "/catalog" },
  { name: "Contacto", href: "/contact" },
];

export const ADMIN_MENU: MenuLink[] = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/admin" },
  { name: "Productos", href: "/admin/products" },
  { name: "Logs", href: "/admin/logs" },
  { name: "Log out", href: "/api/auth/signout" },
];

export const SOCIAL_MENU: MenuLinkWithIcon[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/tiempo_noble.mx/",
    icon: Instagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/tiemponoble.mx",
    icon: Facebook,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@tiempo_noble.mx",
    icon: Tiktok,
  },
];
