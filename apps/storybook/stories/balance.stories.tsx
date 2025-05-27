import {
  Balance,
  BalanceInput,
  BalanceOptions,
  BalanceText,
} from "@composer-kit/ui/balance";
import { Identity } from "@composer-kit/ui/identity";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Identity> = {
  component: Identity,
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Identity>;

const tokens = [
  {
    chainId: 42220,
    symbol: "CELO",
    name: "Celo",
    address: "0x471ece3750da237f93b8e339c536989b8978a438",
    decimals: 18,
  },
  {
    address: "0x765de816845861e75a25fca122bb6898b8b1282a",
    chainId: 42220,
    decimals: 18,
    name: "cUSD",
    symbol: "cUSD",
  },
  {
    address: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
    chainId: 42220,
    decimals: 6,
    name: "USDT",
    symbol: "USDT",
  },
  {
    address: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
    chainId: 42220,
    decimals: 6,
    name: "USDC",
    symbol: "USDC",
  },
  {
    address: "0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73",
    chainId: 42220,
    decimals: 18,
    name: "cEUR",
    symbol: "cEUR",
  },
  {
    address: "0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787",
    chainId: 42220,
    decimals: 18,
    name: "cREAL",
    symbol: "cREAL",
  },
  {
    address: "0x73F93dcc49cB8A239e2032663e9475dd5ef29A08",
    chainId: 42220,
    decimals: 18,
    name: "eXOF",
    symbol: "eXOF",
  },
  {
    address: "0x456a3D042C0DbD3db53D5489e98dFb038553B0d0",
    chainId: 42220,
    decimals: 18,
    name: "cKES",
    symbol: "cKES",
  },
  {
    address: "0x105d4A9306D2E55a71d2Eb95B81553AE1dC20d7B",
    chainId: 42220,
    decimals: 18,
    name: "PUSO",
    symbol: "PUSO",
  },
  {
    address: "0x8A567e2aE79CA692Bd748aB832081C45de4041eA",
    chainId: 42220,
    decimals: 18,
    name: "cCOP",
    symbol: "cCOP",
  },
  {
    address: "0xfAeA5F3404bbA20D3cc2f8C4B0A888F55a3c7313",
    chainId: 42220,
    decimals: 18,
    name: "cGHS",
    symbol: "cGHS",
  },
  {
    address: "0x4F604735c1cF31399C6E711D5962b2B3E0225AD3",
    chainId: 42220,
    decimals: 18,
    name: "USDGLO",
    symbol: "USDGLO",
  },
];

export const Primary: Story = {
  render: () => {
    return (
      <Balance>
        <div className="flex gap-2">
          <BalanceOptions tokens={tokens} />
          <BalanceInput />
        </div>
        <BalanceText />
      </Balance>
    );
  },
  name: "Balance",
  args: {},
};
