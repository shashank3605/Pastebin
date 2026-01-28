import { HashRouter, Routes, Route } from "react-router-dom";
import PastebinPost from "./PastebinPost";
import PastebinGet from "./PastebinGet";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PastebinPost />} />
        <Route path="/paste/:id" element={<PastebinGet />} />
      </Routes>
    </HashRouter>
  );
}
