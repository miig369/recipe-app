type CardProps = {
  img: string;
  title: string;
};

const Card = ({ img, title }: CardProps) => {
  return (
    <div className="recipe">
      <img src={img} alt={`${title} recipe`} />
      <p>{title}</p>
    </div>
  );
};

export default Card;
