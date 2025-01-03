import { Recipes } from "../types";

type Props = {
  recipe: Recipes
};

const Card = ({ recipe }: Props) => {
  return (
    <div className="recipe">
      <img src={recipe.image} alt={`${recipe.title} recipe`} />
      <p>{recipe.title}</p>
    </div>
  );
};

export default Card;
