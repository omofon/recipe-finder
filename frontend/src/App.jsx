import Navigation from "./components/Navigation";
import Main from "./components/Main";

export default function App() {
  return (
    <div className="min-h-screen bg-paper">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Main />
      </div>
    </div>
  );
}