// import React from "react";
// import "./App.css";
// import MainBody from "./components/UserDashboard";

// function App() {
//   return (
//     <div className="relative">
//       <div className="absolute inset-0">
//         <MainBody />
//       </div>
//     </div>
//   );
// }

// export default App;
import { MusicMarketplaceExamples } from './components/MarketPlaceSDK';

function App() {
  const runTest = () => {
    MusicMarketplaceExamples.runExamples()
      .then(() => console.log("Examples finished successfully"))
      .catch(error => console.error("Error running examples:", error));
  }

  return (
    <div>
      <h1>Music Marketplace SDK Test</h1>
      <button onClick={runTest}>Run Examples</button>
      <div>Check console for results</div>
    </div>
  );
}

export default App;