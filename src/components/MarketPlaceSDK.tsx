import {
  AptosClient,
  AptosAccount,
  FaucetClient,
  CoinClient,
  Types,
  HexString,
  TxnBuilderTypes,
} from "aptos";

export class MusicMarketplaceSDK {
  private client: AptosClient;
  private coinClient: CoinClient;
  private moduleAddress: string;
  private vcCoinType: string;

  constructor(
    nodeUrl: string,
    moduleAddress: string,
    vcCoinType: string
  ) {
    this.client = new AptosClient(nodeUrl);
    this.coinClient = new CoinClient(this.client);
    this.moduleAddress = moduleAddress;
    this.vcCoinType = vcCoinType;
  }

  // Account Management
  async setupNewAccount(account: AptosAccount): Promise<string> {
    const payload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::music_marketplace::setup_account`,
      type_arguments: [],
      arguments: []
    };

    return await this.submitTransaction(account, payload);
  }

  // Song Management
  async createAndListSong(
    account: AptosAccount,
    name: string,
    mp3Url: string,
    thumbnailUrl: string,
    price: number
  ): Promise<string> {
    const payload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::music_marketplace::create_and_list_song`,
      type_arguments: [],
      arguments: [name, mp3Url, thumbnailUrl, price]
    };

    return await this.submitTransaction(account, payload);
  }

  async listSong(
    account: AptosAccount,
    songObjectId: string,
    price: number
  ): Promise<string> {
    const payload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::music_marketplace::list_song`,
      type_arguments: [],
      arguments: [songObjectId, price]
    };

    return await this.submitTransaction(account, payload);
  }

  async unlistSong(
    account: AptosAccount,
    songObjectId: string
  ): Promise<string> {
    const payload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::music_marketplace::unlist_song`,
      type_arguments: [],
      arguments: [songObjectId]
    };

    return await this.submitTransaction(account, payload);
  }

  // async toggleBuyable(
  //   account: AptosAccount,
  //   songObjectId: string,
  //   buyable: boolean
  // ): Promise<string> {
  //   const payload = {
  //     type: "entry_function_payload",
  //     function: `${this.moduleAddress}::music_marketplace::toggle_buyable`,
  //     type_arguments: [],
  //     arguments: [songObjectId, buyable]
  //   };

  //   return await this.submitTransaction(account, payload);
  // }

  async updateSongPrice(
    account: AptosAccount,
    songObjectId: string,
    newPrice: number
  ): Promise<string> {
    const payload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::music_marketplace::update_price`,
      type_arguments: [],
      arguments: [songObjectId, newPrice]
    };

    return await this.submitTransaction(account, payload);
  }

  // Marketplace Interactions
  async purchaseSong(
    account: AptosAccount,
    listingObjectId: string
  ): Promise<string> {
    const payload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::music_marketplace::purchase_song`,
      type_arguments: [this.vcCoinType],
      arguments: [listingObjectId]
    };

    return await this.submitTransaction(account, payload);
  }

  async playSong(
    account: AptosAccount,
    songObjectId: string
  ): Promise<string> {
    const payload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::music_marketplace::play_song`,
      type_arguments: [this.vcCoinType],
      arguments: [songObjectId]
    };

    return await this.submitTransaction(account, payload);
  }

  async getSongData(songObjectId: string): Promise<SongData> {
    try {
      const resource = await this.client.getAccountResource(
        songObjectId,
        `${this.moduleAddress}::music_marketplace::SongNFT`
      );
      const data = resource.data as any;
      return {
        name: data.name,
        artist_address: data.artist_address,
        owner_address: data.owner_address,
        mp3_url: data.mp3_url,
        thumbnail_url: data.thumbnail_url,
        buyable: data.buyable
      };
    } catch (error) {
      throw new Error(`Failed to fetch song data: ${error}`);
    }
  }


  async getUserSongs(userAddress: string): Promise<string[]> {
    try {
      const resource = await this.client.getAccountResource(
        userAddress,
        `${this.moduleAddress}::music_marketplace::UserProfile`
      );
      return (resource.data as any).owned_songs;
    } catch {
      return [];
    }
  }

  async getCreatedSongs(userAddress: string): Promise<string[]> {
    try {
      const resource = await this.client.getAccountResource(
        userAddress,
        `${this.moduleAddress}::music_marketplace::UserProfile`
      );
      return (resource.data as any).created_songs;
    } catch {
      return [];
    }
  }
  async getListedSongs(): Promise<ListedSong[]> {
    try {
      const marketplaceResource = await this.client.getAccountResource(
        this.moduleAddress,
        `${this.moduleAddress}::music_marketplace::Marketplace`
      );

      console.log("Raw marketplace data:", marketplaceResource.data);
      // Access the inner vector data structure
      const listings = (marketplaceResource.data as any).listings.inner.data;

      if (!Array.isArray(listings)) {
        console.log("Listings structure:", listings);
        return [];
      }

      return listings.map((listing: any) => ({
        song: listing.song,
        price: Number(listing.price),
        seller: listing.seller
      }));
    } catch (error) {
      console.log("Error fetching listings:", error);
      return [];
    }
  }

  async getVCBalance(address: string): Promise<number> {
    try {
      const balance = await this.coinClient.checkBalance(address);
      return Number(balance);
    } catch {
      return 0;
    }
  }

  // Helper Functions
  private async submitTransaction(
    account: AptosAccount,
    payload: Types.EntryFunctionPayload
  ): Promise<string> {
    const txnRequest = await this.client.generateTransaction(account.address(), payload);
    const signedTxn = await this.client.signTransaction(account, txnRequest);
    const transactionRes = await this.client.submitTransaction(signedTxn);
    await this.client.waitForTransaction(transactionRes.hash);
    return transactionRes.hash;
  }
}

// Types
interface SongData {
  name: string;
  artist_address: string;
  owner_address: string;
  mp3_url: string;
  thumbnail_url: string;
  buyable: boolean;
  price?: number;
}

interface ListedSong {
  song: string;
  price: number;
  seller: string;
}

// Usage Examples
export class MusicMarketplaceExamples {
  static async runExamples() {
    const MODULE_ADDRESS = "0x6a2e8e921ba90f18d0ea667c4d1d77d8736c38a815c6cea61821a57fd56ace91";
    const NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";
    const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";
    const VC_COIN_TYPE = `${MODULE_ADDRESS}::vc_coin::VCCoin`;


    // Initialize SDK
    const sdk = new MusicMarketplaceSDK(
      NODE_URL,
      MODULE_ADDRESS,
      VC_COIN_TYPE
    );

    // Create new account
    const account = new AptosAccount();
    console.log("New account address:", account.address().hex());

    const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);
    try {
      await faucetClient.fundAccount(account.address(), 100000000);
      console.log("Successfully funded account");
    } catch (error) {
      console.error("Failed to fund account:", error);
      return;
    }
    await sdk.setupNewAccount(account);
    console.log("Account setup complete");
    // Create a song
    const createTxn = await sdk.createAndListSong(
      account,
      "My First Song",
      "https://ipfs.io/ipfs/song.mp3",
      "https://ipfs.io/ipfs/thumbnail.jpg",
      1000 // 1000 VC coin
    );
    console.log("Created song:", createTxn);

    // Get user's songs
    const userSongs = await sdk.getUserSongs(account.address().toString());
    console.log("User songs:", userSongs);

    // List a song
    if (userSongs.length > 0) {
      const listTxn = await sdk.listSong(
        account,
        userSongs[0],
        1500 // 1500 VC coins
      );
      console.log("Listed song:", listTxn);
    }

    // After creating the song
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
    const listedSongs = await sdk.getListedSongs();
    console.log("Listed songs:", listedSongs);

    // Purchase a song
    if (listedSongs.length > 0) {
      const purchaseTxn = await sdk.purchaseSong(
        account,
        listedSongs[0].song
      );
      console.log("Purchased song:", purchaseTxn);
    }

    // Play a song
    if (userSongs.length > 0) {
      const playTxn = await sdk.playSong(
        account,
        userSongs[0]
      );
      console.log("Played song:", playTxn);
    }

    // Check VC balance
    const balance = await sdk.getVCBalance(account.address().toString());
    console.log("VC balance:", balance);
  }
}
export default MusicMarketplaceSDK;
