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
  async createSong(
    account: AptosAccount,
    name: string,
    mp3Url: string,
    thumbnailUrl: string,
    price: number,
    buyable: boolean
  ): Promise<string> {
    const payload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::music_marketplace::create_song`,
      type_arguments: [],
      arguments: [name, mp3Url, thumbnailUrl, price, buyable]
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

  async toggleBuyable(
    account: AptosAccount,
    songObjectId: string,
    buyable: boolean
  ): Promise<string> {
    const payload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::music_marketplace::toggle_buyable`,
      type_arguments: [],
      arguments: [songObjectId, buyable]
    };

    return await this.submitTransaction(account, payload);
  }

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

  // Query Functions
  async getSongData(songObjectId: string): Promise<SongData> {
    try {
      const resource = await this.client.getAccountResource(
        songObjectId,
        `${this.moduleAddress}::music_marketplace::SongNFT`
      );
      return resource.data as SongData;
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
      const resource = await this.client.getAccountResource(
        this.moduleAddress,
        `${this.moduleAddress}::music_marketplace::Marketplace`
      );
      return (resource.data as any).listings;
    } catch {
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
  song_id: string;
  price: number;
  seller: string;
}

// Usage Examples
export class MusicMarketplaceExamples {
  static async runExamples() {
    // Initialize SDK
    const sdk = new MusicMarketplaceSDK(
      'https://fullnode.devnet.aptoslabs.com/v1',
      '0x1234', // Your module address
      '0x1::vibechain::VCCoin' // Your VC coin type
    );

    // Create new account
    const account = new AptosAccount();
    await sdk.setupNewAccount(account);

    // Create a song
    const createTxn = await sdk.createSong(
      account,
      "My First Song",
      "https://ipfs.io/ipfs/song.mp3",
      "https://ipfs.io/ipfs/thumbnail.jpg",
      1000, // 1000 VC coins
      true // buyable
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

    // Get all listed songs
    const listedSongs = await sdk.getListedSongs();
    console.log("Listed songs:", listedSongs);

    // Purchase a song
    if (listedSongs.length > 0) {
      const purchaseTxn = await sdk.purchaseSong(
        account,
        listedSongs[0].song_id
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