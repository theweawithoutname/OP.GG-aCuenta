
import SummonerProfile from "./SummonerProfile";

function App() {
  const mockData = {
    name: "MockSummonerName",
    level: 42,
    profileIconUrl: "https://media.istockphoto.com/id/636379014/es/foto/manos-la-formaci%C3%B3n-de-una-forma-de-coraz%C3%B3n-con-silueta-al-atardecer.jpg?s=612x612&w=0&k=20&c=R2BE-RgICBnTUjmxB8K9U0wTkNoCKZRi-Jjge8o_OgE=" // Debe ser una URL válida
  };

  return (
    <div className="p-8">
      <SummonerProfile data={mockData} /> 
    </div>
  );
}

export default App;