import { Recipes } from "../types";
import { AiOutlineLike } from "react-icons/ai";

type Props = {
  recipe: Recipes;
  onClick: () => void;
};

const Card = ({ recipe, onClick }: Props) => {
  return (
    <div className="recipe">
      <img src={recipe.image} alt={`${recipe.title} recipe`} />
      <div className="recipe-details">
      <p>{recipe.title}</p>
      <AiOutlineLike onClick={onClick} style={{backgroundColor: 'red'}}/>
      </div>
     
      
    </div>
  );
};

export default Card;
