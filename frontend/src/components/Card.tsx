import { Recipes } from "../types";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";

type Props = {
  recipe: Recipes;
  onClick: () => void;
  onFavouriteButtonClick: (recipe: Recipes) => void;
  isFavourite: boolean;
  isLoggedIn: () => void;
};

const Card = ({
  recipe,
  onClick,
  onFavouriteButtonClick,
  isFavourite,
}: Props) => {
  return (
    <div className="recipe" onClick={onClick}>
      <img src={recipe.image} alt={`${recipe.title} recipe`} />
      <div className="recipe-details">
        <p>{recipe.title}</p>

        <span
          onClick={(event) => {
            event.stopPropagation();
            onFavouriteButtonClick(recipe);
          }}
        >
          {isFavourite ? (
            <>
              <FaBookmark style={{ color: "f4b860", fontSize: "2.4rem" }} />
              Saved
            </>
          ) : (
            <>
              <FaRegBookmark style={{ color: "f4b860", fontSize: "2.4rem" }} />
              Save
            </>
          )}
        </span>
      </div>
    </div>
  );
};

export default Card;
