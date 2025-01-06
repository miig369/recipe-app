import dotenv from "dotenv";
dotenv.config();

export const apiKey = process.env.API_KEY;

export const searchRecipes = async (searchTerm: string, page: number) => {
  if (!apiKey) {
    throw new Error("API key not available");
  }

  const url = new URL("https://api.spoonacular.com/recipes/complexSearch");

  const queryParams = {
    apiKey,
    query: searchTerm,
    number: "15",
    offset: (page * 15).toString(),
  };

  url.search = new URLSearchParams(queryParams).toString();

  try {
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getRecipeById = async (recipeId: string) => {
  if (!apiKey) {
    throw new Error("API key not available");
  }

  const url = new URL(
    `https://api.spoonacular.com/recipes/${recipeId}/summary`
  );
  const params = { apiKey };
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url);
  const responseJson = await response.json();

  return responseJson;
};

export const getFavouriteRecipeById = async (ids: string[]) => {
    if (!apiKey) {
        throw new Error("API Key not found");
      }
    
      const url = new URL("https://api.spoonacular.com/recipes/informationBulk");
      const params = {
        apiKey: apiKey,
        ids: ids.join(","),
      };
      url.search = new URLSearchParams(params).toString();
    
      const searchResponse = await fetch(url);
      const json = await searchResponse.json();
    
      return { results: json };
};
