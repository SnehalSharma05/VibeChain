script {
    use aptos_framework::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use MyMusicApp::music_nft::{Self as MusicNFT};

    const PLAY_FEE_PERCENTAGE: u8 = 5;
    const E_INSUFFICIENT_BALANCE: u64 = 1;

    fun main(player: &signer, nft_address: address) {
        let player_addr = signer::address_of(player);
        
        // Get artist address and NFT price
        let artist_addr = MusicNFT::get_artist(nft_address);
        let nft_price = MusicNFT::get_price(nft_address);


        // Calculate play fee
        let play_fee = (nft_price * (PLAY_FEE_PERCENTAGE as u64)) / 100;

        // Check if player has sufficient balance
        assert!(
            coin::balance<AptosCoin>(player_addr) >= play_fee,
            E_INSUFFICIENT_BALANCE
        );

        // Transfer play fee from player to artist
        coin::transfer<AptosCoin>(player, artist_addr, play_fee);
    }
}
