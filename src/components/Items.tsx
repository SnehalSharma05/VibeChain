interface ItemsProps {
    walletAddress: string;
    songs: any[];
}
function Items({ walletAddress, songs }: ItemsProps) {
    const handleButtonClick = (e: React.MouseEvent, action: string) => {
        if (!walletAddress) {
            e.preventDefault();
            alert("Please connect your Petra wallet first");
            return;
        }
    };

    return (
        <ul className="p-1.5 flex flex-wrap">
            {songs.map((song) => (
                <li className="w-full lg:w-1/2 xl:w-1/3 p-1.5" key={song.ipfs_url}>
                    <div className="block bg-zinc-800 rounded-md w-full overflow-hidden pb-4 shadow-lg">
                        <div
                            className="w-full h-40 bg-center bg-cover relative"
                            style={{ backgroundImage: `url(${song.image_url})` }}
                        >
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-5/6 bg-white rounded-md flex items-center bg-opacity-30 backdrop-blur-md">
                                <div className="w-full p-3">
                                    <h3 className="font-semibold">Current Price</h3>
                                    <div className="">{song.price} VC</div>
                                </div>
                            </div>
                        </div>
                        <h3 className="font-semibold text-lg px-3 mt-2">{song.name}</h3>
                        <div className="flex items-center px-3 mt-2">
                            <span className="text-zinc-400">{song.genre}</span>
                        </div>
                        <div className="flex mt-2">
                            <div className="p-3 w-1/2">
                                <button
                                    onClick={(e) => handleButtonClick(e, "play")}
                                    className="bg-gradient-to-tr from-fuchsia-600 to-violet-600 w-full h-12 rounded-md font-semibold"
                                >
                                    Play Song
                                </button>
                            </div>
                            <div className="p-3 w-1/2">
                                <button className="bg-gradient-to-tr from-fuchsia-600 to-violet-600 w-full rounded-md font-semibold h-12 p-px">
                                    <div className="bg-zinc-800 w-full h-full rounded-md grid place-items-center">
                                        Buy Now
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
