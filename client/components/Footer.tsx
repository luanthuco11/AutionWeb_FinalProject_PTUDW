"use client";

import Link from "next/link";

interface FooterLinkItem {
  name: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLinkItem[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Hỗ trợ",
    links: [
      {
        name: "Trợ giúp",
        href: "https://flowbite.com/",
      },
      {
        name: "Liên hệ",
        href: "https://tailwindcss.com/",
      },
      {
        name: "FAQs",
        href: "https://tailwindcss.com/",
      },
    ],
  },
  {
    title: "Về chúng tôi",
    links: [
      {
        name: "Về AuctionHub",
        href: "https://github.com/themesberg/flowbite",
      },
      {
        name: "Điều khoản",
        href: "https://discord.gg/4eeurUVvTy",
      },
      {
        name: "Quyền riêng tư",
        href: "https://discord.gg/4eeurUVvTy",
      },
    ],
  },
  {
    title: "Theo dõi",
    links: [
      {
        name: "Facebook",
        href: "https://github.com/themesberg/flowbite",
      },
      {
        name: "Twitter",
        href: "https://discord.gg/4eeurUVvTy",
      },
      {
        name: "Instagram",
        href: "https://discord.gg/4eeurUVvTy",
      },
    ],
  },
];
export const Footer = () => {
  return (
    <div className="w-full  mx-auto p-4 md:py-8 bg-[var(--color-primary)]  text-white">
      <div className="md:flex md:justify-center">
        <div className="grid grid-cols-1 gap-8 sm:gap-16 md:gap-32 sm:grid-cols-3">
          {footerColumns.map((column, indexCol) => (
            <div key={indexCol}>
              <h2 className="mb-6 text-md font-semibold ">{column.title}</h2>
              <ul className="">
                {column.links.map((link, indexLink) => (
                  <li key={indexLink}>
                    <Link className="hover:text-gray-200" href={link.href}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <hr className="my-6  lg:w-3/4 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div className="mx-auto">
        <span className="block text-sm sm:text-center">
          © 2025{" "}
          <Link href="https://flowbite.com/" className="">
            AuctionHub
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </div>
  );
};
