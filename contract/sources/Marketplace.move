module MyMusicApp::Marketplace {
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::signer;
    use aptos_framework::aptos_coin::AptosCoin;
    use MyMusicApp::music_nft::{Self as MusicNFT};

    struct Listing has store {
        nft: MusicNFT::MusicNFT,
        owner: address,
        price: u64,
    }

    struct Listings has key {
        listings: vector<Listing>,
    }

    public fun init_listings(owner: &signer) {
        move_to(owner, Listings {
            listings: vector::empty<Listing>(),
        });
    }

    public fun list_nft(
        owner: &signer,
        nft: MusicNFT::MusicNFT,
        price: u64,
    ) acquires Listings {
        let listing = Listing {
            nft,
            owner: signer::address_of(owner),
            price,
        };
        
        let listings_ref = borrow_global_mut<Listings>(signer::address_of(owner));
        vector::push_back(&mut listings_ref.listings, listing);
    }
                    public fun buy_nft(
                        buyer: &signer,
                        seller_address: address,
                        listing_index: u64,
                    ) acquires Listings {
                        let buyer_address = signer::address_of(buyer);
                        let listings_ref = borrow_global_mut<Listings>(seller_address);
        
                        let Listing { nft, owner, price } = vector::remove(&mut listings_ref.listings, listing_index);

                        // Transfer the sale price from buyer to seller
                        coin::transfer<AptosCoin>(buyer, seller_address, price);

                        // Use the new getter functions
                        let royalty_percentage = MusicNFT::get_royalty_percentage_from_nft(&nft);
                        let royalty_fee = (price * (royalty_percentage as u64)) / 100;
                        let artist_address = MusicNFT::get_artist_from_nft(&nft);
                        coin::transfer<AptosCoin>(buyer, artist_address, royalty_fee);

                        // Transfer the NFT to the buyer
                        MusicNFT::transfer(nft, buyer)
                    }
    }


