import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Project from "./pages/projects/Project";
import LegalMention from "./pages/legal-mention/LegalMention";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="/legal-mentions" element={<LegalMention />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
