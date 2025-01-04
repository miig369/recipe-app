export const searchRecipes = async (searchTerm: string, page: Number) => {
  const baseUrl = new URL("http://localhost:8080/api/recipes/search");
  baseUrl.searchParams.append("searchTerm", searchTerm);
  baseUrl.searchParams.append("page", String(page));

  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error("HTTP Error! Status: " + response.status);
  }

  return response.json();
};

export const getRecipeDetails = async (recipeId: string) => {
        const url = new URL(`http://localhost:8080/api/recipes/${recipeId}/summary`);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("HTTP Error! Status: " + response.status);
        }
        const result = await response.json();
        return result;
}
