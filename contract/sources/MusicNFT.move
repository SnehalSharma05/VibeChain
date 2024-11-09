module MyMusicApp::music_nft {
    use std::string::String;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::signer;

    // Error codes
    const ENOT_AUTHORIZED: u64 = 1;
    const EINVALID_ROYALTY: u64 = 2;
    const EINVALID_PRICE: u64 = 3;

    struct MusicNFT has key, store {
        id: u64,
        title: String,
        artist: address,
        price: u64,
        royalty_percentage: u8,
    }

    // Events
    #[event]
    struct MusicNFTMinted has drop, store {
        id: u64,
        artist: address,
        price: u64
    }

    #[event]
    struct MusicNFTPriceUpdated has drop, store {
        id: u64,
        old_price: u64,
        new_price: u64
    }

    public fun mint(
        creator: &signer,
        id: u64,
        title: String,
        price: u64,
        royalty_percentage: u8
    ): MusicNFT {
        assert!(royalty_percentage <= 100, EINVALID_ROYALTY);
        assert!(price > 0, EINVALID_PRICE);

        let artist = signer::address_of(creator);
        
        event::emit(MusicNFTMinted {
            id,
            artist,
            price
        });

        MusicNFT {
            id,
            title,
            artist,
            price,
            royalty_percentage,
        }
    }

    public fun set_price(
        nft: &mut MusicNFT,
        artist: &signer,
        new_price: u64,
    ) {
        assert!(new_price > 0, EINVALID_PRICE);
        assert!(nft.artist == signer::address_of(artist), ENOT_AUTHORIZED);
        
        let old_price = nft.price;
        nft.price = new_price;

        event::emit(MusicNFTPriceUpdated {
            id: nft.id,
            old_price,
            new_price
        });
    }
    public fun transfer(nft: MusicNFT, recipient: &signer) {
        move_to(recipient, nft);
    }

    #[view]
    public fun get_artist(nft_address: address): address acquires MusicNFT {
        let music_nft = borrow_global_mut<MusicNFT>(nft_address);
        music_nft.artist
    }

    #[view]
    public fun get_price(nft_address: address): u64 acquires MusicNFT {
        let music_nft = borrow_global_mut<MusicNFT>(nft_address);
        music_nft.price
    }

    #[view]
    public fun get_artist_by_nft(nft_address: address): address acquires MusicNFT {
        let music_nft = borrow_global<MusicNFT>(nft_address);
        music_nft.artist
    }

    #[view]
    public fun get_royalty_percentage(nft_address: address): u8 acquires MusicNFT {
        let music_nft = borrow_global<MusicNFT>(nft_address);
        music_nft.royalty_percentage
    }

    #[view]
    public fun get_title(nft_address: address): String acquires MusicNFT {
        let music_nft = borrow_global<MusicNFT>(nft_address);
        music_nft.title
    }
    // #[view]
    // public fun get_nft(nft_address: address): &MusicNFT acquires MusicNFT {
    //     borrow_global<MusicNFT>(nft_address)
    // }
    
// Add these new functions to MusicNFT.move
public fun get_royalty_percentage_from_nft(nft: &MusicNFT): u8 {
    nft.royalty_percentage
}

public fun get_artist_from_nft(nft: &MusicNFT): address {
    nft.artist
}


}
