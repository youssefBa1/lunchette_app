import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AgendaView from "./views/AgendaView";
import TeamView from "./views/Team";
import HomeView from "./views/Home";

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<HomeView></HomeView>}></Route>
          <Route path="/agenda" element={<AgendaView></AgendaView>}></Route>
          <Route path="/team" element={<TeamView></TeamView>}></Route>
        </Routes>
      </>
    </Router>
  );
}

export default App;
