import { useState, useEffect, useRef } from "react";
import * as api from "./helpers/api";
import Card from "./components/Card";
import { Recipes } from "./types";
import Modal from "./components/Modal";

const App = () => {
  const recipee = {
    id: 716429,
    title: "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
    image: "https://img.spoonacular.com/recipes/716429-312x231.jpg",
    imageType: "jpg",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState<Recipes[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipes | undefined>(
    undefined
  );
  const pageNumber = useRef(1);

  useEffect(() => {
    getRecipes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    try {
      const nextPageResults = await api.searchRecipes(searchTerm, nextPage);
      setRecipes([...recipes, ...nextPageResults.results]);
      pageNumber.current = nextPage;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <div className="hero">
        <header>
          <div className="wrapper">
            <nav>
              <h1>Foodie</h1>
              <div>
                <button className="secondary-button">Sign in</button>
                <button className="primary-button">Sign Up</button>
              </div>
            </nav>
          </div>
        </header>
        <section className="search-wrapper">
          <div className="wrapper">
            <h1>Explore a world of recipes from around the world</h1>
            <input
              type="text"
              placeholder="Enter recipe"
              required
              onChange={handleChange}
              value={searchTerm}
            />
            <button className="primary-button" onClick={getRecipes}>
              Search
            </button>
          </div>
        </section>
      </div>
      <div className="wrapper">
        <section className="recipes-wrapper">
          <h1>Recipes</h1>
          <div className="recipes">
            {recipes.map((recipe) => {
              return (
                <Card
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              );
            })}
          </div>
          <button className="primary-button" onClick={viewMoreRecipes}>
            More Recipes
          </button>
        </section>
      </div>
      {selectedRecipe && <Modal recipeId={selectedRecipe.id.toString()} onClose={()=>setSelectedRecipe(undefined)}/>}
    </main>
  );
};

export default App;
