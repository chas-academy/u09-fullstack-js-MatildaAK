import Card from "../Card/Card";
import gardenImage from "../../assets/images/snowdrops.svg";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";

const GardenShop = () => {
  const navigate = useNavigate();

  const goToGarden = () => {
    navigate("/garden");
  };

  return (
    <>
      <Card
        title="Din personliga handelsträdgård!"
        backgroundImage={gardenImage}
        footer={(
          <Button
          type="button"
          size="small"
          variant="primary"
          onClick={goToGarden}
        >
          Till handelsträdgården
        </Button>
        )}
      >
        Här hittar ni fantstiskt många olika växter, många fina
        trädgårdstillbehör och sist men inte minst inspiration och kunskap
      </Card>
    </>
  );
};

export default GardenShop;
