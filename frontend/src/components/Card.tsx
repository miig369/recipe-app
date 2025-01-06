import { Recipes } from "../types";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { useState } from "react";

type Props = {
  recipe: Recipes;
  onClick: () => void;
  saveRecipe?: () => void;
  removeRecipe?: () => void;
};

const Card = ({ recipe, onClick, saveRecipe, removeRecipe }: Props) => {
    
  return (
    <div className="recipe" onClick={onClick}>
      <img src={recipe.image} alt={`${recipe.title} recipe`} />
      <div className="recipe-details">
        <p>{recipe.title}</p>

        {false ? (
          <span onClick={saveRecipe}>
            <FaRegBookmark style={{ color: "f4b860", fontSize: "2.4rem" }} />
            Save
          </span>
        ) : (
          <span onClick={removeRecipe}>
            <FaBookmark style={{ color: "f4b860", fontSize: "2.4rem" }} />
            Saved
          </span>
        )}
      </div>
    </div>
  );
};

export default Card;
