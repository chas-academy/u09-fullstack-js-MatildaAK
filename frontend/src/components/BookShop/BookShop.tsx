import Card from "../Card/Card";
import bookImage from "../../assets/images/books.svg";

const BookShop = () => {
    return (
      <>
      <Card 
        title="Bokhandel"
        backgroundImage={bookImage}>
        Besök vår mysiga bok avdelning och hitta en bok att köpa eller låna.
      </Card>
      </>
    );
  };
  
  export default BookShop;
  