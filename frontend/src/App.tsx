import { useState, useEffect } from "react";
import * as api from "./helpers/api";
import Card from "./components/Card";
import { Recipes } from "./types";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState<Recipes[]>([]);

  useEffect(() => {
    getRecipes();
  }, []);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getRecipes = async () => {
    try {
      const result = await api.searchRecipes(searchTerm, 1);
      setRecipes(result.results);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="wrapper">
      <section className="search">
        <input
          type="text"
          placeholder="Enter recipe"
          required
          onChange={handleChange}
          value={searchTerm}
        />
        <button onClick={getRecipes}>Search</button>
      </section>
      <section className="recipes-wrapper">
        <h1>Recipes</h1>
        {recipes.map((recipe) => {
          return (
            <Card key={recipe.id} img={recipe.image} title={recipe.title} />
          );
        })}
      </section>
    </div>
  );
};

export default App;
