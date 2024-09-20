import Card from "../Card/Card";
import coffeeImage from "../../assets/images/coffee.svg";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";

const CoffeeInfo = () => {
  const navigate = useNavigate();

  const goToCafe = () => {
    navigate("/cafe");
  };
    return (
      <>
      <Card 
        title="Njut av en fika i vårat café!"
        backgroundImage={coffeeImage}
        footer={(
          <Button
          type="button"
          size="small"
          variant="primary"
          onClick={goToCafe}
        >
          Till cafét
        </Button>
        )}>
        Kom in på en härlig fikastund med hembakade kakor och lyxiga mackor.
      </Card>
      </>
    );
  };
  
  export default CoffeeInfo;
  