import { defineConfig } from "vocs";

export default defineConfig({
  title: "Composer Kit",
  sidebar: [
    {
      text: "Guide",
      collapsed: false,
      items: [
        {
          text: "Installation",
          link: "/installation",
        },
        {
          text: "ComposerKitProvider",
          link: "/composer-kit-provider",
        },
        {
          text: "Theme",
          link: "/theme",
        },
      ],
    },
    {
      text: "Components",
      collapsed: false,
      items: [
        {
          text: "Address",
          link: "/components/address",
        },
        {
          text: "Balance",
          link: "/components/balance",
        },
        {
          text: "Identity",
          link: "/components/identity",
        },
        {
          text: "nft",
          collapsed: false,
          items: [
            {
              text: "NFTCard",
              link: "/components/nft/nft-card",
            },
            {
              text: "NFTMint",
              link: "/components/nft/nft-mint",
            },
          ],
        },
        {
          text: "Payment",
          link: "/components/payment",
        },
        {
          text: "Swap",
          link: "/components/swap",
        },
        {
          text: "Transaction",
          link: "/components/transaction",
        },
        {
          text: "TokenSelect",
          link: "/components/token-select",
        },
        {
          text: "Wallet",
          link: "/components/wallet",
        },
      ],
    },
  ],
});
