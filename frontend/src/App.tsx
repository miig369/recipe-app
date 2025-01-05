import { useState, useEffect, useRef } from "react";
import * as api from "./helpers/api";
import Card from "./components/Card";
import { Recipes } from "./types";
import RecipeModal from "./components/RecipeModal";
import AuthModal from "./components/AuthModal";
import { useCookies } from "react-cookie";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken;
  const username = cookies.Username;
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState<Recipes[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipes | undefined>(
    undefined
  );
  const [favouriteRecipes, setFavouriteRecipes] = useState([]);
  const pageNumber = useRef(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const getFavourites = async () => {
    const response = await fetch(
      "http://localhost:8080/http://localhost:5173/"
    );
    const result = await response.json();
    setFavouriteRecipes(result);
  };

  const signOut = () => {
    removeCookie("Email");
    removeCookie("AuthToken");
    window.location.reload();
  };

  return (
    <main>
      <h3>Welcome back {username}</h3>
      {isModalOpen ? <AuthModal onClick={() => setIsModalOpen(false)} /> : null}
      <div className="hero">
        <header>
          <div className="wrapper">
            <nav>
              <h1>Foodie</h1>
              <div>
                {!authToken ? (
                  <>
                    <button
                      className="secondary-button"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Sign in
                    </button>
                    <button
                      className="primary-button"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <button className="primary-button" onClick={signOut}>
                    Sign Out
                  </button>
                )}
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

      {/* button to view favourates need to be loggedin */}
      {authToken ? (
        <>
          <h1>Favourite Recipes</h1>
          <button onClick={getFavourites}>hello</button>
          {favouriteRecipes}
        </>
      ) : (
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
      )}
      {selectedRecipe && (
        <RecipeModal
          recipeId={selectedRecipe.id.toString()}
          onClose={() => setSelectedRecipe(undefined)}
        />
      )}
    </main>
  );
};

export default App;
