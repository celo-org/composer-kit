# Composer Kit — Hooks Reference

A comprehensive guide to all hooks available in `@composer-kit/ui`.

## Table of Contents

- [useBalance](#usebalance) — Read ERC20 token balance
- [useIdentity](#useidentity) — Resolve ENS name and avatar
- [useSocial](#usesocial) — Fetch social links from ENS
- [useNFTData](#usenftdata) — Fetch NFT metadata and ownership
- [useMintNFT](#usemintnft) — Mint NFTs on Celo
- [useTransactionHandler](#usetransactionhandler) — Execute transactions with status tracking
- [useTransactionLifecycle](#usetransactionlifecycle) — Track transaction lifecycle status
- [useConfig](#useconfig) — Access wagmi configuration

---

## useBalance

Read an ERC20 token balance for a given address.

### Import

```tsx
import { useBalance } from "@composer-kit/ui/core/internal/hooks/use-balance";
```

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `address` | `Address` | The wallet address to check |
| `tokenMetaData` | `{ address: Address; decimals: number }` | Token contract address and decimals |

### Returns

| Field | Type | Description |
|---|---|---|
| `balance` | `string` | Formatted balance (e.g. `"1.234"`) |
| `error` | `string` | Error message if query failed |
| `response` | `UseReadContractReturnType` | Raw wagmi response object |

### Example

```tsx
import { useBalance } from "@composer-kit/ui/core/internal/hooks/use-balance";
import { celo } from "viem/chains";

const USDC_ADDRESS = "0xcebA9300f2b948710d2653dD7B07f33A8B32118C";

function TokenBalance({ address }: { address: `0x${string}` }) {
  const { balance, error } = useBalance({
    address,
    tokenMetaData: {
      address: USDC_ADDRESS,
      decimals: 18,
    },
  });

  if (error) return <p>Error: {error}</p>;
  return <p>Balance: {balance} USDC</p>;
}
```

### Notes

- Uses `wagmi`'s `useReadContract` under the hood
- Balance is formatted using `formatUnits` from `viem`
- Returns `"0"` when no data is available
- Works with any ERC20 token on any chain

---

## useIdentity

Resolve an Ethereum address to its ENS name and avatar. Must be used within an `<Identity>` provider.

### Import

```tsx
import { useIdentity } from "@composer-kit/ui/identity";
```

### Prerequisites

Wrap your component tree with the `<Identity>` provider:

```tsx
import { Identity } from "@composer-kit/ui/identity";

function App() {
  return (
    <Identity address="0x1234...5678">
      <MyComponent />
    </Identity>
  );
}
```

### Returns

| Field | Type | Description |
|---|---|---|
| `address` | `Address` | The original address |
| `name` | `string` | ENS name (e.g. `"vitalik.eth"`) or empty string |
| `avatar` | `string` | ENS avatar URL or empty string |
| `balance` | `string` | Token balance (currently `"0"`) |
| `token` | `"CELO" \| "cUSD" \| "USDT"` | Token type |

### Example

```tsx
import { Identity, useIdentity, Avatar, Name } from "@composer-kit/ui/identity";

function UserProfile() {
  return (
    <Identity address="0x1234...5678" token="CELO">
      <Avatar />
      <Name />
      <BalanceDisplay />
    </Identity>
  );
}

function BalanceDisplay() {
  const { balance, token } = useIdentity();
  return <span>{balance} {token}</span>;
}
```

### Notes

- Uses `wagmi`'s `useEnsName` and `useEnsAvatar` internally
- Resolves ENS on Ethereum mainnet (chainId: 1)
- Shows a loading state while resolving
- Throws if used outside `<Identity>` provider

---

## useSocial

Fetch social links (GitHub, Twitter, Farcaster, URL) from ENS text records.

### Import

```tsx
import { useSocial } from "@composer-kit/ui/identity/hooks/use-social";
```

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `ensName` | `string` | The ENS name to look up (e.g. `"vitalik.eth"`) |
| `tag` | `"github" \| "twitter" \| "url" \| "farcaster"` | Which social link to fetch |

### Returns

| Field | Type | Description |
|---|---|---|
| `tag` | `string` | The social platform tag |
| `url` | `string \| null` | The resolved URL or null if not found |

### Example

```tsx
import { useSocial } from "@composer-kit/ui/identity/hooks/use-social";

function SocialLinks({ ensName }: { ensName: string }) {
  const github = useSocial({ ensName, tag: "github" });
  const twitter = useSocial({ ensName, tag: "twitter" });
  const farcaster = useSocial({ ensName, tag: "farcaster" });

  return (
    <div>
      {github?.url && <a href={github.url}>GitHub</a>}
      {twitter?.url && <a href={twitter.url}>Twitter</a>}
      {farcaster?.url && <a href={farcaster.url}>Farcaster</a>}
    </div>
  );
}
```

### Notes

- Reads ENS text records on Ethereum mainnet
- Uses `com.github`, `com.twitter`, `com.farcaster` keys
- Returns `null` if the text record doesn't exist
- Uses `getPublicClient` from internal config

---

## useNFTData

Fetch NFT metadata and ownership information from a contract on Celo.

### Import

```tsx
import { useNFTData } from "@composer-kit/ui/nft/hooks/use-nft-data";
```

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `contractAddress` | `` `0x${string}` `` | The NFT contract address |
| `tokenId` | `bigint` | The token ID to fetch |

### Returns

| Field | Type | Description |
|---|---|---|
| `tokenId` | `bigint` | The requested token ID |
| `owner` | `string` | Current owner address |
| `tokenURI` | `string` | Raw token URI from contract |
| `metadata` | `NFTMetadata \| null` | Parsed metadata (name, description, image, attributes) |
| `loading` | `boolean` | True while fetching |
| `error` | `Error \| null` | Error if fetch failed |

### Example

```tsx
import { useNFTData } from "@composer-kit/ui/nft/hooks/use-nft-data";

function NFTCard({ contractAddress, tokenId }: Props) {
  const { metadata, owner, loading, error } = useNFTData(
    contractAddress,
    BigInt(tokenId)
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <img src={metadata?.image} alt={metadata?.name} />
      <h3>{metadata?.name}</h3>
      <p>{metadata?.description}</p>
      <small>Owner: {owner}</small>
    </div>
  );
}
```

### Notes

- Reads from Celo mainnet (chainId: 42220)
- Automatically resolves `ipfs://` URIs to `https://ipfs.io/ipfs/`
- Supports standard ERC721 `ownerOf` and `tokenURI` calls
- Metadata is fetched from the resolved URI (HTTP or IPFS)

---

## useMintNFT

Mint NFTs on the Celo chain with support for various contract patterns.

### Import

```tsx
import { useMintNFT } from "@composer-kit/ui/nft/hooks/use-nft-mint";
```

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `contractAddress` | `string` | The NFT contract address |

### Returns

| Field | Type | Description |
|---|---|---|
| `mint` | `(params: MintParams) => Promise<void>` | Function to mint an NFT |
| `txHash` | `` `0x${string}` \| null `` | Transaction hash after submission |
| `isPending` | `boolean` | True while transaction is pending |
| `isLoading` | `boolean` | True while contract is being written to |
| `error` | `Error \| null` | Error if minting failed |
| `receipt` | `any` | Transaction receipt after confirmation |
| `isSuccess` | `boolean` | True after successful mint |
| `reset` | `() => void` | Clear all state |

### MintParams

| Field | Type | Description |
|---|---|---|
| `to` | `string` | Recipient address (defaults to connected wallet) |
| `tokenId` | `bigint` | Optional specific token ID |
| `tokenURI` | `string` | Optional token URI for metadata |
| `metadata` | `Record<string, any>` | Optional metadata (would be uploaded to IPFS) |
| `quantity` | `number` | Optional quantity for batch minting |

### Example

```tsx
import { useMintNFT } from "@composer-kit/ui/nft/hooks/use-nft-mint";

function MintButton({ contractAddress }: { contractAddress: string }) {
  const { mint, isPending, isSuccess, error, txHash } = useMintNFT(contractAddress);

  const handleMint = async () => {
    await mint({
      to: "0x1234...5678",
      tokenURI: "ipfs://Qm.../metadata.json",
    });
  };

  return (
    <div>
      <button onClick={handleMint} disabled={isPending}>
        {isPending ? "Minting..." : "Mint NFT"}
      </button>
      {isSuccess && <p>✅ Minted! TX: {txHash}</p>}
      {error && <p>❌ {error.message}</p>}
    </div>
  );
}
```

### Notes

- Supports multiple mint patterns: `mint`, `safeMint`, `mintWithTokenURI`, `createItem`, `createCollectible`
- Auto-detects the correct function by trying different signatures
- Supports batch minting via `mintBatch`, `mintMultiple`, `mintMany`, `batchMint`
- Works on Celo mainnet (chainId: 42220)
- Requires a connected wallet

---

## useTransactionHandler

Execute a contract transaction with automatic chain switching and status tracking.

### Import

```tsx
import { useTransactionHandler } from "@composer-kit/ui/transaction/hooks/use-transaction-handler";
```

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `chainId` | `number` | Target chain ID |
| `transaction` | `Transaction` | Transaction details (address, abi, functionName, args) |
| `onSuccess` | `(receipt) => void` | Callback on successful transaction |
| `onError` | `(error) => void` | Callback on failed transaction |
| `updateStatus` | `(status: LifeCycleStatus) => void` | Status update callback |

### Returns

| Field | Type | Description |
|---|---|---|
| `executeTransaction` | `() => Promise<void>` | Function to execute the transaction |
| `transactionHash` | `string` | Transaction hash |
| `transactionReceipt` | `WaitForTransactionReceiptReturnType \| null` | Receipt after confirmation |
| `reset` | `() => void` | Reset all state |
| `setTransactionHash` | `(hash: string) => void` | Manually set hash |
| `setTransactionReceipt` | `(receipt) => void` | Manually set receipt |

### Example

```tsx
import { useTransactionHandler } from "@composer-kit/ui/transaction/hooks/use-transaction-handler";
import { useTransactionLifecycle } from "@composer-kit/ui/transaction/hooks/use-transaction-life-cycle";

function SendTransaction() {
  const { lifeCycleStatus, updateStatus } = useTransactionLifecycle();

  const { executeTransaction, transactionHash } = useTransactionHandler({
    chainId: 42220, // Celo
    transaction: {
      address: "0x...",
      abi: myAbi,
      functionName: "transfer",
      args: ["0x...", BigInt(1000000)],
    },
    onSuccess: (receipt) => console.log("Done!", receipt),
    onError: (err) => console.error("Failed!", err),
    updateStatus,
  });

  return (
    <div>
      <button onClick={executeTransaction}>Send</button>
      <p>Status: {lifeCycleStatus.status}</p>
      {transactionHash && <p>TX: {transactionHash}</p>}
    </div>
  );
}
```

### Notes

- Automatically switches chain if wallet is on wrong network
- Uses `wagmi`'s `useSendTransaction` and `waitForTransactionReceipt`
- Encodes function data using `viem`'s `encodeFunctionData`
- Status flows: `idle` → `buildingTransaction` → `pending` → `success`/`error`

---

## useTransactionLifecycle

Track the lifecycle status of a transaction. Use with `useTransactionHandler`.

### Import

```tsx
import { useTransactionLifecycle } from "@composer-kit/ui/transaction/hooks/use-transaction-life-cycle";
```

### Returns

| Field | Type | Description |
|---|---|---|
| `lifeCycleStatus` | `LifeCycleStatus` | Current status with message |
| `updateStatus` | `(status: LifeCycleStatus) => void` | Update the status |

### LifeCycleStatus

```ts
interface LifeCycleStatus {
  message: string;
  status: "idle" | "buildingTransaction" | "pending" | "success" | "error";
}
```

### Example

```tsx
const { lifeCycleStatus, updateStatus } = useTransactionLifecycle();

// Status messages
switch (lifeCycleStatus.status) {
  case "idle": return "Ready";
  case "buildingTransaction": return "Preparing...";
  case "pending": return "Waiting for confirmation...";
  case "success": return "✅ Success!";
  case "error": return "❌ Failed";
}
```

---

## useConfig

Access or create wagmi configuration for Composer Kit.

### Import

```tsx
import { useConfig } from "@composer-kit/ui/core/use-config";
```

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `wagmiConfig` | `CreateConfigParameters` | Optional custom wagmi config |

### Returns

| Field | Type | Description |
|---|---|---|
| `wagmiConfig` | `Config` | The wagmi configuration object |
| `queryClient` | `QueryClient \| null` | The React Query client |

### Example

```tsx
import { useConfig } from "@composer-kit/ui/core/use-config";

function App() {
  const { wagmiConfig, queryClient } = useConfig({});

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <YourApp />
      </QueryClientProvider>
    </WagmiConfig>
  );
}
```

### Notes

- Default config includes Celo, Celo Alfajores, and Ethereum mainnet
- Uses RainbowKit's `injectedWallet` connector
- Falls back to default config if no custom config is provided
- Auto-creates a QueryClient if one isn't available in context

---

## Contributing

Found an issue or want to add a new hook? Check the [open issues](https://github.com/celo-org/composer-kit/issues) or submit a PR!

## License

MIT © Celo
