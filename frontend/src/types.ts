export interface Recipes {
  id: number;
  image: string;
  title: string;
  imageType: string;
}

export interface RecipeSummary {
  id: number;
  title: string;
  summary: string;
}

export type Tabs= "recipes" | "favourites"; 