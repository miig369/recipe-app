import { useState, useEffect, useRef } from "react";
import * as api from "./helpers/api";
import Card from "./components/Card";
import { Recipes } from "./types";
import RecipeModal from "./components/RecipeModal";
import AuthModal from "./components/AuthModal";
import { useCookies } from "react-cookie";
import { Tabs } from "./types";

const App = () => {
  //@ts-ignore
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken;
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState<Recipes[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipes | undefined>(
    undefined
  );
  const [favouriteRecipes, setFavouriteRecipes] = useState<Recipes[]>([]);
  const pageNumber = useRef(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<Tabs>("recipes");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        await Promise.all([getRecipes(), getFavourites()]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRecipes();
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
    try {
      const result = await api.getFavouriteRecipes();
      setFavouriteRecipes(result.results);
    } catch (error) {
      console.log(error);
    }
  };

  const addFavouriteRecipe = async (recipe: Recipes) => {
    try {
      await api.addFavouriteRecipe(recipe);
      setFavouriteRecipes([...favouriteRecipes, recipe]);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFavouriteRecipe = async (recipe: Recipes) => {
    try {
      await api.removeFavouriteRecipe(recipe);
      const updatedRecipes = favouriteRecipes.filter(
        (favRecipe) => recipe.id !== favRecipe.id
      );
      setFavouriteRecipes(updatedRecipes);
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = () => {
    removeCookie("Username");
    removeCookie("AuthToken");
    window.location.reload();
  };

  return (
    <main>
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
            <button
              className="primary-button"
              onClick={() => {
                getRecipes();
                setSearchTerm("");
              }}
            >
              Search
            </button>
          </div>
        </section>
      </div>
      <div className="tabs">
        <button
          className={selectedTab === "recipes" ? "selected-tab" : "tab"}
          onClick={() => setSelectedTab("recipes")}
        >
          All recipes
        </button>
        <button
          className={selectedTab === "favourites" ? "selected-tab" : "tab"}
          onClick={() => {
            if (authToken) {
              setSelectedTab("favourites");
              getFavourites();
            } else {
              setIsModalOpen(true);
            }
          }}
        >
          Favourites
        </button>
      </div>
      {selectedTab === "favourites" && (
        <div className="wrapper">
          <section className="recipes-wrapper">
            <h1>Favourite Recipes</h1>
            <div className="recipes">
              {favouriteRecipes.map((recipe) => {
                return (
                  <Card
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => setSelectedRecipe(recipe)}
                    onFavouriteButtonClick={deleteFavouriteRecipe}
                    isFavourite={true}
                    isLoggedIn={() => undefined}
                  />
                );
              })}
            </div>
          </section>
        </div>
      )}

      {selectedTab === "recipes" && (
        <div className="wrapper">
          <section className="recipes-wrapper">
            <h1>Recipes</h1>
            <div className="recipes">
              {recipes.map((recipe) => {
                const isFavourite = favouriteRecipes.some(
                  (favRecipe) => recipe.id === favRecipe.id
                );
                return (
                  <Card
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => setSelectedRecipe(recipe)}
                    onFavouriteButtonClick={
                      isFavourite ? deleteFavouriteRecipe : addFavouriteRecipe
                    }
                    isFavourite={isFavourite}
                    isLoggedIn={() => !authToken && setIsModalOpen(true)}
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
