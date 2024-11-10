const API_URL = 'http://localhost:5000/api';

const updateSonglist = async (songDetails) => {
    try {
        const response = await fetch(`${API_URL}/songs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(songDetails)
        });

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error updating songlist:', error);
        return false;
    }
};

const changeOwnership = async (ipfsUrl, newOwnerAddress) => {
    try {
        const songs = await getSonglist();
        const updatedSongs = songs.map(song => {
            if (song.ipfs_url === ipfsUrl) {
                return {
                    ...song,
                    owner_address: newOwnerAddress,
                    buyable: true
                };
            }
            return song;
        });

        const response = await fetch(`${API_URL}/songs`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedSongs)
        });

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error changing ownership:', error);
        return false;
    }
};

const changeBuyability = async (ipfsUrl) => {
    try {
        const songs = await getSonglist();
        const updatedSongs = songs.map(song => {
            if (song.ipfs_url === ipfsUrl) {
                return {
                    ...song,
                    buyable: !song.buyable
                };
            }
            return song;
        });

        const response = await fetch(`${API_URL}/songs`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedSongs)
        });

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error changing buyability:', error);
        return false;
    }
};

const getBuyableSongs = async (address) => {
    try {
        const response = await fetch(`${API_URL}/songs`);
        const songs = await response.json();
        return songs.filter(song =>
            song.buyable === true &&
            song.owner_address !== address
        );
    } catch (error) {
        console.error('Error fetching buyable songs:', error);
        return [];
    }
};

const getMySongs = async (address) => {
    try {
        const response = await fetch(`${API_URL}/songs`);
        const songs = await response.json();
        return songs.filter(song =>
            song.owner_address === address
        );
    } catch (error) {
        console.error('Error fetching my songs:', error);
        return [];
    }
};

const getSonglist = async () => {
    try {
        const response = await fetch(`${API_URL}/songs`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching songlist:', error);
        return [];
    }
};

const getArtistStats = async (artistAddress) => {
    return {
        totalPlays: 1234567,
        totalEarnings: 45.32,
        monthlyPlays: 123456,
        monthlyEarnings: 12.34,
        topSongs: [
            { title: "Ethereal Melodies", plays: 500000, earnings: 15.5 },
            { title: "Digital Dreams", plays: 300000, earnings: 12.3 },
            { title: "Crypto Beats", plays: 250000, earnings: 8.7 },
        ]
    };
};

export { getArtistStats };


export {
    updateSonglist,
    getBuyableSongs,
    getMySongs,
    getSonglist,
    changeOwnership,
    changeBuyability
};
