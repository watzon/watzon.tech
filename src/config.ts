import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://watzon.tech/",
  author: "Chris Watson",
  desc: "Personal website and blog of Chris Watson",
  title: "Watzon Does Tech",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 5,
};

export const LOCALE = ["en-US"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/watzon",
    linkTitle: ` Watzon on Github`,
    active: true,
  },
  {
    name: "Mastodon",
    href: "https://watzonmanor.com/@watzon",
    linkTitle: `Watzon on Mastodon`,
    active: true,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@3dprintifer",
    linkTitle: `Watzon on TikTok`,
    active: true,
  }
];
