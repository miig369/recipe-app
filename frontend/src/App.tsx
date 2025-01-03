import { useState, useEffect, useRef } from "react";
import * as api from "./helpers/api";
import Card from "./components/Card";
import { Recipes } from "./types";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState<Recipes[]>([]);
  const pageNumber = useRef(1)

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
      pageNumber.current = 1;
    } catch (error) {
      console.error(error);
    }
  };

  const viewMoreRecipes = async () => {
    const nextPage = pageNumber.current + 1;

    try{
      const nextPageResults = await api.searchRecipes(searchTerm, nextPage)
      setRecipes([...recipes, ...nextPageResults.results])
      pageNumber.current = nextPage;
    }catch(error){
      console.error(error)
    }
  }

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
            <Card key={recipe.id} recipe={recipe} />
          );
        })}

        <button className="view-more-btn" onClick={viewMoreRecipes}>More Recipes</button>
      </section>
    </div>
  );
};

export default App;
