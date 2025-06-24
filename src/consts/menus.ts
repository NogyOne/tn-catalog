import type { MenuLink, MenuLinkWithIcon } from "../types/menusLinks";

export const MAIN_MENU: MenuLink[] = [
    { name: "Inicio", href: "/" },
    { name: "Catálogo", href: "/catalog" },    
    { name: "Contacto", href: "/contact" },
]

export const ADMIN_MENU : MenuLink[] = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/admin" },
    { name: "Productos", href: "/admin/products" },    
    { name: "Logs", href: "/admin/logs" },
    { name: "Log out", href: "/api/auth/signout" },
]

export const SOCIAL_MENU: MenuLinkWithIcon[] = [
    { 
        name: "Instagram", 
        href: "https://www.instagram.com/tiempo_noble.mx/", 
        icon: "/icons/instragram-icon.svg" },
    { 
        name: "Facebook", 
        href: "https://www.facebook.com/tiemponoble.mx", 
        icon: "/icons/facebook-icon.svg" },
    { 
        name: "TikTok", 
        href: "https://www.tiktok.com/@tiempo_noble.mx", 
        icon: "/icons/tiktok-icon.svg" },    
]