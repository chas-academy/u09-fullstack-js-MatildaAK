import Card from "../Card/Card";
import bookImage from "../../assets/images/books.svg";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";

const BookShop = () => {
  const navigate = useNavigate();
  
  const goToBooks = () => {
    navigate("/cafe");
  };
    return (
      <>
      <Card 
        title="Bokhandel"
        backgroundImage={bookImage}
        footer={(
          <Button
          type="button"
          size="small"
          variant="primary"
          onClick={goToBooks}
        >
          Till bokhandeln
        </Button>
        )}>
        Besök vår mysiga bok avdelning och hitta en bok att köpa eller låna.
      </Card>
      </>
    );
  };
  
  export default BookShop;
  