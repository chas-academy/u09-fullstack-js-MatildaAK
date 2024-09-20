import Card from "../Card/Card";
import coffeeImage from "../../assets/images/coffee.svg";

const CoffeeInfo = () => {
    return (
      <>
      <Card 
        title="Njut av en fika i vårat café!"
        backgroundImage={coffeeImage}>
        Kom in på en härlig fikastund med hembakade kakor och lyxiga mackor.
      </Card>
      </>
    );
  };
  
  export default CoffeeInfo;
  