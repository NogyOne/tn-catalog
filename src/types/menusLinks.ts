import type { AstroComponentFactory } from "astro/runtime/server/index.js";

export interface MenuLink {
  name: string;
  href: string;
}

export interface MenuLinkWithIcon extends MenuLink {
  // How can type an icon as Astro Component that inside is an SVG tag?
  icon: AstroComponentFactory | string;
}
