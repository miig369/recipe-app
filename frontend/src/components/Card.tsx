import { Recipes } from "../types";
import { AiOutlineLike } from "react-icons/ai";

type Props = {
  recipe: Recipes;
  onClick: () => void;
};

const Card = ({ recipe, onClick }: Props) => {
  return (
    <div className="recipe" onClick={onClick}>
      <img src={recipe.image} alt={`${recipe.title} recipe`} />
      <div className="recipe-details">
        <p>{recipe.title}</p>
        <AiOutlineLike style={{ backgroundColor: "red" }} />
      </div>
    </div>
  );
};

export default Card;
