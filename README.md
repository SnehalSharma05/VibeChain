# VibeChain: Decentralized Music Streaming Platform

A blockchain-based music streaming platform built on Aptos that revolutionizes music ownership and streaming through NFTs. Artists can tokenize their music, while listeners can both stream and trade music NFTs in a decentralized ecosystem.
## Demo Video
https://youtu.be/q7EE08Q50u4
## Features

- **NFT-Based Music**: Each song is minted as a unique NFT, stored on IPFS
- **Dual Usage Model**: 
  - Buy/Sell music NFTs for ownership
  - Pay-per-listen streaming option for casual listeners
- **Artist Benefits**:
  - Direct monetization through NFT sales
  - Royalties from secondary market trades
  - Streaming revenue share
- **User Features**:
  - Music NFT marketplace
  - Streaming interface
  - Personal collection management
  - Integrated with Petra wallet

## Technology Stack

- **Blockchain**: Aptos
- **Smart Contracts**: Move
- **Storage**: IPFS
- **Frontend**: React Typescript, TailwindCSS
- **Backend**: Express.js

## Prerequisites

- Aptos CLI
- Move compiler
- IPFS node (for development)
- Petra wallet
## Smart Contract Architecture

### Core Contracts - Marketplace.move
   - NFT listing and trading
   - Price management
   - Royalty distribution


## API Reference

### NFT Operations

- `GET /api/nfts`: List all available music NFTs
- `GET /api/nfts/{id}`: Get specific NFT details
- `POST /api/nfts/mint`: Mint new music NFT

### Streaming Operations

- `POST /api/stream/start`: Start streaming session
- `POST /api/stream/end`: End streaming session
- `GET /api/stream/history`: Get streaming history

## Development

```bash
# Run local node
aptos node run-local-testnet

# Deploy contracts
aptos move compile
aptos move publish

```

## Security Considerations

- NFT ownership verification
- Payment processing security
- Access control mechanisms
- IPFS content persistence
