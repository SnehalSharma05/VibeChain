function ProfileSection() {
    const userProfile = {
      name: "John Doe",
      avatar: "https://assets.codepen.io/3685267/nft-dashboard-pro-1.jpg",
      totalCoins: 2345.67,
      purchases: [
        { id: 1, title: "Ethereal Melodies", price: 0.8, date: "2023-12-01" },
        { id: 2, title: "Digital Dreams", price: 1.2, date: "2023-11-28" },
        { id: 3, title: "Crypto Beats", price: 0.5, date: "2023-11-25" },
      ],
      stats: {
        totalSpent: 1234.56,
        tracksOwned: 45,
        artistsSupported: 12,
        joinedDate: "2023",
      },
    };
  
    return (
      <div className="p-6 space-y-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-fuchsia-600"
          />
          <div>
            <h1 className="text-3xl font-bold">{userProfile.name}</h1>
            <p className="text-zinc-400">
              Member since {userProfile.stats.joinedDate}
            </p>
          </div>
        </div>
  
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-800 rounded-lg p-4">
            <h3 className="text-zinc-400 text-sm">VC Balance</h3>
            <p className="text-2xl font-bold">{userProfile.totalCoins} VC</p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <h3 className="text-zinc-400 text-sm">Total Spent</h3>
            <p className="text-2xl font-bold">
              {userProfile.stats.totalSpent} VC
            </p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <h3 className="text-zinc-400 text-sm">Tracks Owned</h3>
            <p className="text-2xl font-bold">{userProfile.stats.tracksOwned}</p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <h3 className="text-zinc-400 text-sm">Artists Supported</h3>
            <p className="text-2xl font-bold">
              {userProfile.stats.artistsSupported}
            </p>
          </div>
        </div>
  
        {/* Recent Purchases */}
        <div className="bg-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Purchases</h2>
          <div className="space-y-4">
            {userProfile.purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between p-4 bg-zinc-700 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{purchase.title}</h3>
                  <p className="text-sm text-zinc-400">{purchase.date}</p>
                </div>
                <p className="font-semibold">{purchase.price} VC</p>
              </div>
            ))}
          </div>
        </div>
  
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-gradient-to-tr from-fuchsia-600 to-violet-600 p-4 rounded-lg font-semibold">
            Add VC Coins
          </button>
          <button className="bg-zinc-700 p-4 rounded-lg font-semibold">
            View All Purchases
          </button>
        </div>
      </div>
    );
  }
  
  export { ProfileSection };