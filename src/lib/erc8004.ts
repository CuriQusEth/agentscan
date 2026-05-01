import { useReadContract } from 'wagmi';

export const identityAbi = [
  {
    "name": "ownerOf",
    "type": "function",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [{ "type": "address" }]
  },
  {
    "name": "tokenURI",
    "type": "function",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [{ "type": "string" }]
  }
];

// Placeholder for the ERC-8004 identity registry. Need to replace with actual deployed address on base mainnet.
export const REGISTRY_ADDRESS = '0x1234567890123456789012345678901234567890'; 

export function useAgent(tokenId: bigint | undefined) {
  const { data: owner, isError: ownerError, isLoading: ownerLoading } = useReadContract({
    address: REGISTRY_ADDRESS,
    abi: identityAbi,
    functionName: 'ownerOf',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined,
    }
  });

  const { data: uri, isError: uriError, isLoading: uriLoading } = useReadContract({
    address: REGISTRY_ADDRESS,
    abi: identityAbi,
    functionName: 'tokenURI',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined,
    }
  });

  return {
    owner: owner as string | undefined,
    uri: uri as string | undefined,
    isLoading: ownerLoading || uriLoading,
    isError: ownerError || uriError
  };
}

export async function fetchMetadata(uri: string) {
  try {
    let fetchUri = uri;
    if (uri.startsWith("ipfs://")) {
      fetchUri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    const res = await fetch(fetchUri);
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch metadata:", error);
    return null;
  }
}
