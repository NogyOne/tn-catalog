import type { MenuLink, MenuLinkWithIcon } from "../types/menusLinks";
import Facebook from "@components/icons/astro/Facebook.astro";
import Instagram from "@components/icons/astro/Instagram.astro";
import Tiktok from "@components/icons/astro/Tiktok.astro";
import Home from "@components/icons/astro/Home.astro";
import Clock from "@components/icons/astro/Clock.astro";
import Logs from "@components/icons/astro/Logs.astro";
import Logout from "@components/icons/astro/Logout.astro";

export const MAIN_MENU: MenuLink[] = [
  { name: "Inicio", href: "/" },
  { name: "Catálogo", href: "/catalog" },
  { name: "Contacto", href: "/contact" },
];

export const ADMIN_MENU: MenuLinkWithIcon[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/admin", icon: Logs },
  { name: "Productos", href: "/admin/products", icon: Clock },
  { name: "Logs", href: "/admin/logs", icon: Logs },
  { name: "Log out", href: "/api/auth/signout", icon: Logout },
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
