#[test_only]
module vibechain_addr::music_marketplace_tests {
    use std::string;
    use std::signer;
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::coin::{Self, MintCapability};
    use aptos_framework::object::{Self, Object};
    use vibechain_addr::music_marketplace::{Self, SongNFT, Listing};

    // Test coin type
    struct VibeCoin {}

    struct TestCap has key {
        mint_cap: MintCapability<VibeCoin>,
    }

    const INITIAL_BALANCE: u64 = 10000;

    fun init_module(creator: &signer) {
        // Initialize test coin
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<VibeCoin>(
            creator,
            string::utf8(b"VibeCoin"),
            string::utf8(b"VIBE"),
            8,
            true
        );
        move_to(creator, TestCap { mint_cap });
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_freeze_cap(freeze_cap);
    }

    // Add 'acquires' annotation here
    fun setup_test(aptos_framework: &signer) : (signer, signer, signer) acquires TestCap{
        // Create test accounts
        let artist = account::create_account_for_test(@0x123);
        let buyer = account::create_account_for_test(@0x456);
        let another_user = account::create_account_for_test(@0x789);

        // Initialize module
        music_marketplace::init_module(aptos_framework);
        
        // Initialize test coin
        init_module(aptos_framework);
        
        // Register accounts for VibeCoin
        coin::register<VibeCoin>(&artist);
        coin::register<VibeCoin>(&buyer);
        coin::register<VibeCoin>(&another_user);
        
        // Mint and deposit initial coins to test accounts
        let mint_cap = &borrow_global<TestCap>(@aptos_framework).mint_cap;
        
        coin::deposit(signer::address_of(&artist), 
            coin::mint(INITIAL_BALANCE, mint_cap));
        coin::deposit(signer::address_of(&buyer), 
            coin::mint(INITIAL_BALANCE, mint_cap));
        coin::deposit(signer::address_of(&another_user), 
            coin::mint(INITIAL_BALANCE, mint_cap));

        (artist, buyer, another_user)
    }

    // Add 'acquires' annotation to all test functions that call setup_test
    #[test(aptos_framework = @aptos_framework)]
    fun test_create_song(aptos_framework: &signer) acquires TestCap {
        let (artist, _buyer, _another_user) = setup_test(aptos_framework);
        
        let name = string::utf8(b"Test Song");
        let mp3_url = string::utf8(b"https://example.com/song.mp3");
        let thumbnail_url = string::utf8(b"https://example.com/thumb.jpg");
        let price = 100;
        let buyable = true;

        // Create song
        music_marketplace::create_song(
            &artist,
            name,
            mp3_url,
            thumbnail_url,
            price,
            buyable,
        );

        // Verify song creation
        let created_songs = music_marketplace::get_created_songs(signer::address_of(&artist));
        assert!(vector::length(&created_songs) == 1, 0);

        let owned_songs = music_marketplace::get_user_songs(signer::address_of(&artist));
        assert!(vector::length(&owned_songs) == 1, 1);

        let song = vector::borrow(&created_songs, 0);
        let (song_name, artist_addr, owner_addr, _, _, is_buyable) = 
            music_marketplace::get_song_data(*song);
        
        assert!(song_name == name, 2);
        assert!(artist_addr == signer::address_of(&artist), 3);
        assert!(owner_addr == signer::address_of(&artist), 4);
        assert!(is_buyable == buyable, 5);
    }

    #[test(aptos_framework = @aptos_framework)]
    fun test_list_and_purchase_song(aptos_framework: &signer) acquires TestCap, SongNFT, Listing {
        let (artist, buyer, _another_user) = setup_test(aptos_framework);
        
        // Create song
        let name = string::utf8(b"Test Song");
        let mp3_url = string::utf8(b"https://example.com/song.mp3");
        let thumbnail_url = string::utf8(b"https://example.com/thumb.jpg");
        let price = 100;
        let buyable = true;

        music_marketplace::create_song(
            &artist,
            name,
            mp3_url,
            thumbnail_url,
            price,
            buyable,
        );

        let songs = music_marketplace::get_created_songs(signer::address_of(&artist));
        let song = *vector::borrow(&songs, 0);

        // List song
        music_marketplace::list_song(&artist, song, price);

        // Purchase song
        let listing_obj = get_listing_object(song);
        let artist_initial_balance = coin::balance<VibeCoin>(signer::address_of(&artist));
        
        music_marketplace::purchase_song<VibeCoin>(&buyer, listing_obj);

        // Verify ownership transfer
        let (_, _, new_owner, _, _, _) = music_marketplace::get_song_data(song);
        assert!(new_owner == signer::address_of(&buyer), 0);

        // Verify payment distribution
        let royalty = (price * 10) / 100; // 10% royalty
        let seller_amount = price - royalty;
        
        assert!(
            coin::balance<VibeCoin>(signer::address_of(&artist)) == 
            artist_initial_balance + price,
            1
        );
    }

    #[test(aptos_framework = @aptos_framework)]
    fun test_play_song(aptos_framework: &signer) acquires TestCap, SongNFT {
        let (artist, buyer, _another_user) = setup_test(aptos_framework);
        
        music_marketplace::create_song(
            &artist,
            string::utf8(b"Test Song"),
            string::utf8(b"https://example.com/song.mp3"),
            string::utf8(b"https://example.com/thumb.jpg"),
            100,
            true,
        );

        let songs = music_marketplace::get_created_songs(signer::address_of(&artist));
        let song = *vector::borrow(&songs, 0);

        let artist_initial_balance = coin::balance<VibeCoin>(signer::address_of(&artist));
        let buyer_initial_balance = coin::balance<VibeCoin>(signer::address_of(&buyer));

        music_marketplace::play_song<VibeCoin>(&buyer, song);

        assert!(
            coin::balance<VibeCoin>(signer::address_of(&artist)) == 
            artist_initial_balance + 1,
            0
        );
        assert!(
            coin::balance<VibeCoin>(signer::address_of(&buyer)) == 
            buyer_initial_balance - 1,
            1
        );
    }

    #[test(aptos_framework = @aptos_framework)]
    #[expected_failure(abort_code = 5)]
    fun test_list_song_not_owner(aptos_framework: &signer) acquires TestCap, SongNFT {
        let (artist, another_user, _) = setup_test(aptos_framework);
        
        music_marketplace::create_song(
            &artist,
            string::utf8(b"Test Song"),
            string::utf8(b"https://example.com/song.mp3"),
            string::utf8(b"https://example.com/thumb.jpg"),
            100,
            true,
        );

        let songs = music_marketplace::get_created_songs(signer::address_of(&artist));
        let song = *vector::borrow(&songs, 0);

        // Should fail
        music_marketplace::list_song(&another_user, song, 100);
    }

    #[test(aptos_framework = @aptos_framework)]
    #[expected_failure(abort_code = 7)]
    fun test_insufficient_balance(aptos_framework: &signer) acquires TestCap, SongNFT, Listing {
        let (artist, buyer, _) = setup_test(aptos_framework);
        
        music_marketplace::create_song(
            &artist,
            string::utf8(b"Test Song"),
            string::utf8(b"https://example.com/song.mp3"),
            string::utf8(b"https://example.com/thumb.jpg"),
            INITIAL_BALANCE + 1,
            true,
        );

        let songs = music_marketplace::get_created_songs(signer::address_of(&artist));
        let song = *vector::borrow(&songs, 0);
        
        music_marketplace::list_song(&artist, song, INITIAL_BALANCE + 1);
        
        let listing_obj = get_listing_object(song);
        music_marketplace::purchase_song<VibeCoin>(&buyer, listing_obj);
    }

    // Helper function
    fun get_listing_object(song: Object<SongNFT>): Object<Listing> {
        let listing_addr = object::create_object_address(&@vibechain_addr, *string::bytes(&string::utf8(b"listing")));
        object::address_to_object<Listing>(listing_addr)
    }
}