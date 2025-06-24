export interface MenuLink {
    name: string;
    href: string; 
}

export interface MenuLinkWithIcon extends MenuLink {
    icon: string;
}