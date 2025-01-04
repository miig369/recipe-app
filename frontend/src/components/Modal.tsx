import { useState, useEffect } from "react";
import { RecipeSummary } from "../types";
import * as api from '../helpers/api'

type Props = {
    recipeId: string
    onClose: () => void
}

const Modal = ({recipeId, onClose}: Props) => {
  const [recipeDetails, setRecipeDetails] = useState<RecipeSummary>();

  useEffect(()=>{
    const getRecipeSummary = async (recipeId: string)=> {
        const response = await api.getRecipeDetails(recipeId)
        setRecipeDetails(response)
    }
    getRecipeSummary(recipeId);

  }, [recipeId])

  if (!recipeDetails) {
    return <></>;
  }

  return (
    <>
      <div className="overlay"></div>
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{recipeDetails?.title}</h2>
            <span className="close-btn" onClick={onClose}>&times;</span>
          </div>
          <p dangerouslySetInnerHTML={{ __html: recipeDetails?.summary }}></p>
        </div>
      </div>
    </>
  );
};

export default Modal;
