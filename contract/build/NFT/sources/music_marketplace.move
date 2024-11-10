module vibechain_addr::music_marketplace {
    use std::error;
    use std::signer;
    use std::string::{Self, String};
    use std::option;
    use std::vector;
    use aptos_std::smart_vector;
    use aptos_framework::aptos_account;
    use aptos_framework::coin;
    use aptos_framework::object::{Self, Object};
    use aptos_framework::account;

    // Error codes
    const ENO_LISTING: u64 = 1;
    const ENO_SELLER: u64 = 2;
    const EINVALID_PRICE: u64 = 3;
    const EINVALID_ROYALTY: u64 = 4;
    const ENOT_OWNER: u64 = 5;
    const ENOT_BUYABLE: u64 = 6;
    const EINSUFFICIENT_BALANCE: u64 = 7;

    const ROYALTY_PERCENTAGE: u64 = 10; // 10% royalty to original artist
    const INITIAL_COINS: u64 = 1000; // Initial VC coins for new users
    const APP_OBJECT_SEED: vector<u8> = b"VIBECHAIN_MARKETPLACE";

    // Song NFT structure
    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct SongNFT has key {
        name: String,
        artist_address: address,
        owner_address: address,
        mp3_url: String,
        thumbnail_url: String,
        buyable: bool,
        extend_ref: object::ExtendRef,
    }

    // Listing structure
    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct Listing has key {
        song: Object<SongNFT>,
        price: u64,
        seller: address,
        delete_ref: object::DeleteRef,
    }

    struct Marketplace has key {
    listings: smart_vector::SmartVector<Object<Listing>>,
}

    // Marketplace signer for administrative functions
    struct MarketplaceSigner has key {
        extend_ref: object::ExtendRef,
    }

    // User profile to track owned songs
    struct UserProfile has key {
        owned_songs: smart_vector::SmartVector<Object<SongNFT>>,
        created_songs: smart_vector::SmartVector<Object<SongNFT>>,
    }

    // Initialize module
    fun init_module(deployer: &signer) {
        let constructor_ref = object::create_named_object(
            deployer,
            APP_OBJECT_SEED,
        );
        let extend_ref = object::generate_extend_ref(&constructor_ref);
        let marketplace_signer = &object::generate_signer(&constructor_ref);

        move_to(marketplace_signer, MarketplaceSigner {
            extend_ref,
        });

        // Initialize marketplace at the deployer's address
        move_to(deployer, Marketplace {
            listings: smart_vector::new(),
        });
    }

    public entry fun setup_account(account: &signer) {
    let account_addr = signer::address_of(account);
    
    // Initialize user profile if it doesn't exist
    if (!exists<UserProfile>(account_addr)) {
        move_to(account, UserProfile {
            owned_songs: smart_vector::new(),
            created_songs: smart_vector::new(),
        });
    };
}

    

    // Create new song NFT
    public entry fun create_song(
        creator: &signer,
        name: String,
        mp3_url: String,
        thumbnail_url: String,
        price: u64,
        buyable: bool,
    ) acquires UserProfile {
        let creator_addr = signer::address_of(creator);
        
        let constructor_ref = object::create_object(creator_addr);
        let object_signer = &object::generate_signer(&constructor_ref);
        let extend_ref = object::generate_extend_ref(&constructor_ref);

        let song = SongNFT {
            name,
            artist_address: creator_addr,
            owner_address: creator_addr,
            mp3_url,
            thumbnail_url,
            buyable,
            extend_ref,
        };

        move_to(object_signer, song);
        
        // Initialize user profile if it doesn't exist
        if (!exists<UserProfile>(creator_addr)) {
            move_to(creator, UserProfile {
                owned_songs: smart_vector::new(),
                created_songs: smart_vector::new(),
            });
        };

        let song_obj = object::object_from_constructor_ref<SongNFT>(&constructor_ref);
        let profile = borrow_global_mut<UserProfile>(creator_addr);
        smart_vector::push_back(&mut profile.owned_songs, song_obj);
        smart_vector::push_back(&mut profile.created_songs, song_obj);
    }

// We are assuming for now when ever a song is created it is automatically listed for sale 
//     // List song for sale
//     public entry fun list_song(
//         seller: &signer,
//         song: Object<SongNFT>,
//         price: u64
//     ) acquires SongNFT, Marketplace {
//         let song_data = borrow_global<SongNFT>(object::object_address(&song));
//         //assert!(song_data.owner_address == signer::address_of(seller), error::permission_denied(ENOT_OWNER));
//         assert!(song_data.buyable, error::permission_denied(ENOT_BUYABLE));
//         assert!(price > 0, error::invalid_argument(EINVALID_PRICE));

//         let constructor_ref = object::create_object(signer::address_of(seller));
//         let listing_signer = &object::generate_signer(&constructor_ref);
//         let listing_obj = object::object_from_constructor_ref<Listing>(&constructor_ref);


//         move_to(listing_signer, Listing {
//             song,
//             price,
//             seller: signer::address_of(seller),
//             delete_ref: object::generate_delete_ref(&constructor_ref),
//         });
//          let marketplace = borrow_global_mut<Marketplace>(object::object_address(&listing_obj));
//         smart_vector::push_back(&mut marketplace.listings, listing_obj);
// }

//create and list song

// Create new song NFT and automatically list it for sale
public entry fun create_and_list_song(
        creator: &signer,
        name: String,
        mp3_url: String,
        thumbnail_url: String,
        price: u64
    ) acquires UserProfile, Marketplace {
        let creator_addr = signer::address_of(creator);
        let constructor_ref = object::create_object(creator_addr);
        let object_signer = &object::generate_signer(&constructor_ref);
        let extend_ref = object::generate_extend_ref(&constructor_ref);
        let buyable = true;
        let song = SongNFT {
            name,
            artist_address: creator_addr,
            owner_address: creator_addr,
            mp3_url,
            thumbnail_url,
            buyable,
            extend_ref,
        };

        move_to(object_signer, song);

        // Initialize user profile if needed
        if (!exists<UserProfile>(creator_addr)) {
            move_to(creator, UserProfile {
                owned_songs: smart_vector::new(),
                created_songs: smart_vector::new(),
            });
        };

        let song_obj = object::object_from_constructor_ref<SongNFT>(&constructor_ref);
        let profile = borrow_global_mut<UserProfile>(creator_addr);
        smart_vector::push_back(&mut profile.owned_songs, song_obj);
        smart_vector::push_back(&mut profile.created_songs, song_obj);

        // Create listing
        let listing_constructor_ref = object::create_object(creator_addr);
        let listing_signer = &object::generate_signer(&listing_constructor_ref);
        let listing_obj = object::object_from_constructor_ref<Listing>(&listing_constructor_ref);

        move_to(listing_signer, Listing {
            song: song_obj,
            price,
            seller: creator_addr,
            delete_ref: object::generate_delete_ref(&listing_constructor_ref),
        });

        // Get marketplace from module address instead of creator address
        let marketplace = borrow_global_mut<Marketplace>(@vibechain_addr);
        smart_vector::push_back(&mut marketplace.listings, listing_obj);
    }


    // Purchase song
    // Update purchase_song to properly handle listings
    public entry fun purchase_song<CoinType>(
        buyer: &signer,
        listing_obj: Object<Listing>
    ) acquires Listing, SongNFT, UserProfile, Marketplace {
        let listing_addr = object::object_address(&listing_obj);
        let listing = move_from<Listing>(listing_addr);
        let Listing {
            song,
            price,
            seller,
            delete_ref,
        } = listing;

        let buyer_addr = signer::address_of(buyer);
        assert!(coin::balance<CoinType>(buyer_addr) >= price, error::invalid_state(EINSUFFICIENT_BALANCE));

        // Calculate royalty
        let song_data = borrow_global<SongNFT>(object::object_address(&song));
        let royalty = (price * ROYALTY_PERCENTAGE) / 100;
        let seller_amount = price - royalty;

        // Transfer payments
        coin::transfer<CoinType>(buyer, seller, seller_amount);
        coin::transfer<CoinType>(buyer, song_data.artist_address, royalty);

        // Transfer ownership
        let song_obj_mut = borrow_global_mut<SongNFT>(object::object_address(&song));
        song_obj_mut.owner_address = buyer_addr;

        // Update buyer profile
        let buyer_profile = borrow_global_mut<UserProfile>(buyer_addr);
        smart_vector::push_back(&mut buyer_profile.owned_songs, song);

        // Update seller profile
        let seller_profile = borrow_global_mut<UserProfile>(seller);
        let (exists, index) = smart_vector::index_of(&seller_profile.owned_songs, &song);
        if (exists) {
            smart_vector::remove(&mut seller_profile.owned_songs, index);
        };

        // Remove listing from marketplace
        let marketplace = borrow_global_mut<Marketplace>(@vibechain_addr);
        let (exists, index) = smart_vector::index_of(&marketplace.listings, &listing_obj);
        if (exists) {
            smart_vector::remove(&mut marketplace.listings, index);
        };

        // Cleanup listing
        object::delete(delete_ref);
    }

    // Play song (charge small fee)
    public entry fun play_song<CoinType>(
        user: &signer,
        song: Object<SongNFT>
    ) acquires SongNFT {
        let play_fee = 1; // 1 VC coin per play
        let user_addr = signer::address_of(user);
        assert!(coin::balance<CoinType>(user_addr) >= play_fee, error::invalid_state(EINSUFFICIENT_BALANCE));

        let song_data = borrow_global<SongNFT>(object::object_address(&song));
        coin::transfer<CoinType>(user, song_data.artist_address, play_fee);
    }
    //unlist song
public entry fun unlist_song(
    seller: &signer,
    listing_object: Object<Listing>
) acquires Marketplace, Listing {
    let listing_address = object::object_address(&listing_object);
    let Listing {
        song,
        price: _,
        seller: _,
        delete_ref
    } = move_from<Listing>(listing_address);
    
    let marketplace = borrow_global_mut<Marketplace>(listing_address);
    let (exists, index) = smart_vector::index_of(&marketplace.listings, &listing_object);
    if (exists) {
        smart_vector::remove(&mut marketplace.listings, index);
    };
    
    object::delete(delete_ref);
}

    //toggle buyable
public entry fun toggle_buyable(
    owner: &signer,
    song_object: Object<SongNFT>,
    new_buyable: bool
) acquires SongNFT {
    let song_address = object::object_address(&song_object);
    let song = borrow_global_mut<SongNFT>(song_address);
    assert!(song.owner_address == signer::address_of(owner), error::permission_denied(ENOT_OWNER));
    song.buyable = new_buyable;
}

    // Update price
    public entry fun update_price(
    seller: &signer,
    listing_object: Object<Listing>,
    new_price: u64
) acquires Listing {
    let listing_address = object::object_address(&listing_object);
    let listing = borrow_global_mut<Listing>(listing_address);
    assert!(listing.seller == signer::address_of(seller), error::permission_denied(ENO_SELLER));
    assert!(new_price > 0, error::invalid_argument(EINVALID_PRICE));
    listing.price = new_price;
}

    // View functions

    #[view]
    public fun get_song_data(song: Object<SongNFT>): (String, address, address, String, String, bool) acquires SongNFT {
        let song_data = borrow_global<SongNFT>(object::object_address(&song));
        (
            song_data.name,
            song_data.artist_address,
            song_data.owner_address,
            song_data.mp3_url,
            song_data.thumbnail_url,
            song_data.buyable
        )
    }

    #[view]
    public fun get_user_songs(user_addr: address): vector<Object<SongNFT>> acquires UserProfile {
        if (!exists<UserProfile>(user_addr)) {
            return vector::empty()
        };
        smart_vector::to_vector(&borrow_global<UserProfile>(user_addr).owned_songs)
    }

    #[view]
    public fun get_created_songs(user_addr: address): vector<Object<SongNFT>> acquires UserProfile {
        if (!exists<UserProfile>(user_addr)) {
            return vector::empty()
        };
        smart_vector::to_vector(&borrow_global<UserProfile>(user_addr).created_songs)
    }
}