import React, { useRef, useState } from "react";
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import Countdown from "react-countdown";
// import { WalletSelector } from "./WalletSelector";
import "./UserDashboard.css"; // Create this file
import { UploadModal } from "./UploadModal";
declare global {
  interface Window {
    petra: any;
  }
}
// Add interface for ArtistDashboard props
interface ArtistDashboardProps {
  onUpload: () => void;
}
// Add styled components for better organization
const DashboardContainer = {
  height: "100vh",
  backgroundColor: "#09090b",
  color: "white",
  overflowY: "auto",
};

const SidebarStyles = {
  maxHeight: "calc(100vh - 4rem)",
  overflowY: "auto",
};

const getAptosWallet = () => {
  if ('aptos' in window) {
    return window.aptos;
  } else {
    window.open('https://petra.app/', `_blank`);
  }
};
const Icons = {
  market: () => (
    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
  ),
  dashboard: () => (
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  ),
  favourites: () => (
    <path
      fillRule="evenodd"
      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
      clipRule="evenodd"
    />
  ),
  trending: () => (
    <path
      fillRule="evenodd"
      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
      clipRule="evenodd"
    />
  ),
  collection: () => (
    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
  ),
  wallet: () => (
    <>
      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
      <path
        fillRule="evenodd"
        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
        clipRule="evenodd"
      />
    </>
  ),
  settings: () => (
    <path
      fillRule="evenodd"
      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
      clipRule="evenodd"
    />
  ),
  logout: () => (
    <path
      fillRule="evenodd"
      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
      clipRule="evenodd"
    />
  ),
};
const items = [
  {
    key: "1",
    artist: 4,
    image: "https://i.ytimg.com/vi/2SUwOgmvzK4/maxresdefault.jpg",
    price: "0.8",
    title: "Ethereal Melodies",
    timeLeft: 84670923,
  },
  {
    key: "2",
    artist: 2,
    image: "https://i.scdn.co/image/ab6761610000e5ebd0d5560f6b2ebe39a6d20704",
    price: "1.5",
    title: "Playing God",
    timeLeft: 12873491,
  },
  {
    key: "3",
    artist: 0,
    image:
      "https://www.entertainmentvine.com/wp-content/uploads/2014/05/MnM-Banner_534aed4d7c3921c21db8f28e4c41f151.jpg",
    price: "2.0",
    title: "Eminem",
    timeLeft: 84720185,
  },
  {
    key: "4",
    artist: 3,
    image: "/music-covers/track4.jpg",
    price: "1.2",
    title: "Crypto Symphony",
    timeLeft: 43826185,
  },
  {
    key: "5",
    artist: 2,
    image: "/music-covers/track5.jpg",
    price: "0.5",
    title: "Web3 Waves",
    timeLeft: 134627,
  },
  {
    key: "6",
    artist: 1,
    image: "/music-covers/track6.jpg",
    price: "1.0",
    title: "Decentralized Dreams",
    timeLeft: 12008745,
  },
];

const artists = [
  {
    name: "Tame Impala",
    handler: "@tameImapalx",
    image:
      "https://rocknfool.net/wp-content/uploads/2020/02/Tame-Impala-800x445.jpg",
  },
  {
    name: "Polyphia",
    handler: "@Polyphia",
    image:
      "https://preview.redd.it/still-versions-of-my-animated-wallpapers-v0-zryfy6nbfuy91.jpg?width=640&crop=smart&auto=webp&s=d85ad66ffd9a0c989b1f2b969bb3b403795ba7e0",
  },
  {
    name: "Web3 Harmony",
    handler: "@w3harmony",
    image: "/artist-profiles/artist3.jpg",
  },
  {
    name: "Chain Melody",
    handler: "@chainmelody",
    image: "/artist-profiles/artist4.jpg",
  },
  {
    name: "Digital Sound",
    handler: "@digitalsound",
    image: "/artist-profiles/artist5.jpg",
  },
];
const App = () => {
  return (
    <>
      <SidebarLeft />
      <Header />

      <div className="flex flex-col md:flex-row">
        <div className="w-48 hidden lg:block shrink-0" />
        <div className=" grow ">
          <Content />
          <Items />
        </div>
        <SidebarRight />
      </div>
    </>
  );
};

function SidebarRight() {
  return (
    <div className="p-3 md:w-72 shrink-0 md:sticky md:top-16 shrink-0 h-full">
      <h2 className="text-xl font-semibold">Top Artists</h2>
      <ul className="mt-3 space-y-3">
        {artists.map(({ name, handler, image }) => (
          <li
            className="bg-zinc-800 rounded-md p-2 flex shadow-lg"
            key={handler}
          >
            <img
              src={image}
              className="w-12 h-12 rounded-md"
              alt={`top artist ${name}`}
            />
            <div className="ml-3">
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm text-zinc-400">{handler}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="w-full rounded-md bg-gradient-to-tr from-fuchsia-600 to-violet-600 mt-3 p-3 relative overflow-hidden">
        <div className="z-10 relative">
          <h2 className="text-white font-semibold">
            Buy a collection with ethereum
          </h2>
          <p className="text-white/50 text-sm mt-1">
            you can buy a collection of artwork with ethereum very easy and
            simple
          </p>
          <div className="bg-white w-full rounded-md h-12 text-gray-900 font-semibold mt-2">
          <button 
          onClick={async () => {
            try {
              const petra = window.petra;
              if (petra) {
                const response = await petra.connect();
                console.log("Connected account address:", response.address);
              } else {
                window.open('https://petra.app/', '_blank');
              }
            } catch (error) {
              console.log("Petra wallet connection error:", error);
            }
          }}
          className="bg-white w-full rounded-md h-12 text-gray-900 font-semibold mt-2 hover:bg-gray-100 transition-colors"
        >
          {window.petra ? 'Connected to Petra Wallet' : 'Connect to Petra Wallet'}
        </button>
          </div>
        </div>
        <div className="absolute left-0 right-0 top-0 z-0">
          <svg
            className="w-full"
            viewBox="0 0 679 360"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2_2)">
              <path
                d="M102.854 22L159.666 116.276L102.854 90.4544V22Z"
                fill="#8A92B2"
                fillOpacity="0.35"
              />
              <path
                d="M102.854 90.4544L159.666 116.276L102.854 149.866V90.4544Z"
                fill="#62688F"
                fillOpacity="0.35"
              />
              <path
                d="M46.0315 116.276L102.854 22V90.4544L46.0315 116.276Z"
                fill="#62688F"
                fillOpacity="0.35"
              />
              <path
                d="M102.854 149.866L46.0315 116.276L102.854 90.4544V149.866Z"
                fill="#454A75"
                fillOpacity="0.35"
              />
              <path
                d="M159.666 127.055L102.854 207.12V160.625L159.666 127.055Z"
                fill="#8A92B2"
                fillOpacity="0.35"
              />
              <path
                d="M102.854 160.625V207.12L46 127.055L102.854 160.625Z"
                fill="#62688F"
                fillOpacity="0.35"
              />
              <circle
                cx="552"
                cy="35"
                r="132"
                stroke="white"
                strokeOpacity="0.1"
                strokeWidth="10"
              />
              <circle
                cx="640"
                cy="115"
                r="132"
                stroke="white"
                strokeOpacity="0.1"
                strokeWidth="10"
              />
            </g>
            <defs>
              <clipPath id="clip0_2_2">
                <rect width="679" height="360" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Items() {
  return (
    <ul className="p-1.5 flex flex-wrap">
      {items.map(({ key, artist, image, price, title }) => (
        <li className="w-full lg:w-1/2 xl:w-1/3  p-1.5" key={key}>
          <a
            className="block bg-zinc-800 rounded-md w-full overflow-hidden pb-4 shadow-lg"
            href="#items"
          >
            <div
              className="w-full h-40 bg-center bg-cover relative"
              style={{ backgroundImage: `url(${image})` }}
            >
              <div className="absolute left-1/2 -translate-x-1/2 bottom-2  w-5/6 bg-white rounded-md flex items-center bg-opacity-30 backdrop-blur-md">
                <div className="w-full p-3">
                  <h3 className="font-semibold">Current Price</h3>
                  <div className="">{price} ETH</div>
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-lg px-3 mt-2">{title}</h3>
            <div className="flex items-center px-3 mt-2">
              <img
                src={artists[artist].image}
                className="w-10 h-10 rounded-full"
                alt="item-owner"
              />
              <span className=" ml-2 text-zinc-400">
                {artists[artist].handler}
              </span>
            </div>
            <div className="flex mt-2">
              <div className="p-3 w-1/2">
                <button className="bg-gradient-to-tr from-fuchsia-600 to-violet-600  w-full h-12 rounded-md font-semibold">
                  Play Song
                </button>
              </div>
              <div className="p-3 w-1/2">
                <button className="bg-gradient-to-tr from-fuchsia-600 to-violet-600  w-full rounded-md font-semibold h-12 p-px">
                  <div className="bg-zinc-800 w-full h-full rounded-md grid place-items-center">
                    View Artist
                  </div>
                </button>
              </div>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

function ArtworkSelector({ text, index }: { text: string; index: number }) {
  return (
    <li className="">
      <button
        className={` ${
          index ? "text-zinc-500" : "text-fuchsia-600 underline font-bold"
        }`}
      >
        {text}
      </button>
    </li>
  );
}

function Content() {
  return (
    <div className="">
      <h1 className="text-2xl font-bold px-3 mt-3">Music Hub</h1>
      <h2 className="text-zinc-500 px-3">
        Stream and collect exclusive music tracks on the blockchain
      </h2>
      <div className="p-3">
        <div
          className="w-full h-44 rounded-md bg-center bg-cover flex flex-col justify-center px-4"
          style={{
            backgroundImage: "url('/music-banner.jpg')",
          }}
        >
          <h2 className="font-bold text-3xl max-w-sm">
            Discover the Future of Music Streaming
          </h2>
          <button className="py-2 bg-gradient-to-tr from-fuchsia-600 to-violet-600 rounded-md w-44 mt-3">
            Listen Now
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between px-3 mt-3">
        <h2 className="text-xl font-semibold">Trending Tracks</h2>
        <ul className="inline-flex space-x-3">
          {["Popular", "New Releases", "Artists", "Playlists"].map(
            (text, index) => (
              <ArtworkSelector key={text} text={text} index={index} />
            )
          )}
        </ul>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex flex-wrap p-3 items-center sticky top-0 bg-zinc-900 h-fit md:h-16 z-30">
      <div className="flex items-center order-2 md:order-3 pl-0 md:pl-3">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          <div className="absolute right-0 top-0 w-3 h-3 bg-zinc-900 rounded-full p-0.5">
            <div className="bg-red-500 w-full h-full rounded-full" />
          </div>
        </div>
        <img
          src="https://assets.codepen.io/3685267/nft-dashboard-pro-1.jpg"
          alt="user"
          className="w-10 h-10 rounded-full ml-4"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 ml-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <div className="flex justify-center mt-4 md:mt-0 order-3 md:order-2 w-full md:w-1/3 mx-auto">
        <button className="w-10 h-10 rounded-md bg-zinc-700 grid place-items-center mr-2 block md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <form className="relative w-full max-w-md">
          <input
            type="text"
            className="bg-zinc-700 pl-3 pr-10 h-10 rounded-md w-full"
            placeholder="search for songs"
          />
          <span className="absolute right-0 top-0 bottom-0 w-10 grid place-items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </form>
      </div>
    </div>
  );
}

function SidebarItem({
  text,
  index,
}: {
  text: keyof typeof Icons;
  index: number;
}) {
  return (
    <li className="relative">
      {index === 1 ? (
        <div className="absolute -left-1 top-0 bg-fuchsia-600 w-2 h-8 rounded-full" />
      ) : null}
      <a
        href="#"
        className={`pl-4 flex items-center capitalize ${
          index === 1 ? "text-white" : "text-zinc-500"
        }`}
      >
        <span
          className={`bg-zinc-800 w-8 h-8 grid place-items-center mr-2 rounded-md ${
            index === 1 ? "bg-fuchsia-600" : "bg-zinc-800"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            {Icons[text]()}
          </svg>
        </span>
        {text}
      </a>
    </li>
  );
}

function SidebarLeft() {
  return (
    <div className="hidden lg:flex h-screen flex-col justify-between w-48 fixed left-0 top-0 bottom-0 pt-24">
      <ul className="space-y-8">
        {[
          "market",
          "dashboard",
          "favourites",
          "trending",
          "collection",
          "wallet",
          "settings",
        ].map((key, index) => (
          <SidebarItem
            key={key}
            text={key as keyof typeof Icons}
            index={index}
          />
        ))}
      </ul>
      <div className="pb-5  px-4">
        <hr className="mb-5 text-zinc-700" />
        <a href="#" className="py-2 flex items-center  text-zinc-500">
          <span className="bg-zinc-800 w-8 h-8 grid place-items-center mr-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {Icons.logout()}
            </svg>
          </span>
          Logout
        </a>
      </div>
    </div>
  );
}
const artistStats = {
  totalPlays: 1234567,
  totalEarnings: 45.32,
  monthlyPlays: 123456,
  monthlyEarnings: 12.34,
  topSongs: [
    { title: "Ethereal Melodies", plays: 500000, earnings: 15.5 },
    { title: "Digital Dreams", plays: 300000, earnings: 12.3 },
    { title: "Crypto Beats", plays: 250000, earnings: 8.7 },
  ],
};

export function ArtistDashboard({ onUpload }: ArtistDashboardProps) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Artist Dashboard</h1>
        <button
          onClick={onUpload}
          className="bg-gradient-to-tr from-fuchsia-600 to-violet-600 px-6 py-2 rounded-md font-semibold"
        >
          Release New Track
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-800 rounded-lg p-4 shadow-lg">
          <h3 className="text-zinc-400 text-sm">Total Plays</h3>
          <p className="text-2xl font-bold mt-2">
            {artistStats.totalPlays.toLocaleString()}
          </p>
        </div>
        <div className="bg-zinc-800 rounded-lg p-4 shadow-lg">
          <h3 className="text-zinc-400 text-sm">Total Earnings</h3>
          <p className="text-2xl font-bold mt-2">
            {artistStats.totalEarnings} VC
          </p>
        </div>
        <div className="bg-zinc-800 rounded-lg p-4 shadow-lg">
          <h3 className="text-zinc-400 text-sm">Monthly Plays</h3>
          <p className="text-2xl font-bold mt-2">
            {artistStats.monthlyPlays.toLocaleString()}
          </p>
        </div>
        <div className="bg-zinc-800 rounded-lg p-4 shadow-lg">
          <h3 className="text-zinc-400 text-sm">Monthly Earnings</h3>
          <p className="text-2xl font-bold mt-2">
            {artistStats.monthlyEarnings} VC
          </p>
        </div>
      </div>

      <div className="bg-zinc-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Top Performing Songs</h2>
        <div className="space-y-4">
          {artistStats.topSongs.map((song, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-zinc-700 rounded-md"
            >
              <div className="flex items-center">
                <span className="text-lg font-semibold mr-4">#{index + 1}</span>
                <div>
                  <h3 className="font-semibold">{song.title}</h3>
                  <p className="text-sm text-zinc-400">
                    {song.plays.toLocaleString()} plays
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{song.earnings} VC</p>
                <p className="text-sm text-zinc-400">earnings</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-tr from-fuchsia-600 to-violet-600 rounded-lg p-6 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2">
            Ready to Drop Your Next Hit?
          </h2>
          <p className="text-white/70 mb-4">
            Upload your new track and start earning VC coins
          </p>
          <button className="bg-white text-gray-900 px-6 py-2 rounded-md font-semibold">
            Upload Track
          </button>
        </div>
        <div className="absolute right-0 top-0 opacity-10">
          <svg className="w-48 h-48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function MainBody() {
  return (
    <>
      <SidebarLeft />
      <Header />
      <div className="flex flex-col md:flex-row">
        <div className="w-48 hidden lg:block shrink-0" />
        <div className=" grow ">
          <Content />
          <Items />
        </div>
        <SidebarRight />
      </div>
    </>
  );
}

// export default function MainBody() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleUpload = (data: { name: string; price: string }) => {
//     console.log("Upload track:", data);
//     setIsModalOpen(false);
//   };

//   return (
//     <>
//       <SidebarLeft />
//       <Header />
//       <div className="flex flex-col md:flex-row">
//         <div className="w-48 hidden lg:block shrink-0" />
//         <div className="grow">
//           <ArtistDashboard onUpload={() => setIsModalOpen(true)} />
//         </div>
//         <SidebarRight />
//       </div>
//       <UploadModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSubmit={handleUpload}
//       />
//     </>
//   );
// }
