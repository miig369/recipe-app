import { useState, useEffect } from "react";
import { RecipeSummary } from "../types";
import * as api from "../helpers/api";
import Modal from "./Modal";

type Props = {
  recipeId: string;
  onClose: () => void;
};

const RecipeModal = ({ recipeId, onClose }: Props) => {
  const [recipeDetails, setRecipeDetails] = useState<RecipeSummary>();

  useEffect(() => {
    const getRecipeSummary = async (recipeId: string) => {
      const response = await api.getRecipeDetails(recipeId);
      setRecipeDetails(response);
    };
    getRecipeSummary(recipeId);
  }, [recipeId]);

  if (!recipeDetails) {
    return <></>;
  }

  return (
    <Modal title={recipeDetails?.title} onClose={onClose}>
      <p dangerouslySetInnerHTML={{ __html: recipeDetails?.summary }}></p>
    </Modal>
  );
};

export default RecipeModal;
