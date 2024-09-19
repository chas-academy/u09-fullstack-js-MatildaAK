import Card from "../Card/Card";
import gardenImage from "../../assets/images/snowdrops.webp"

const GardenShop = () => {
    return (
      <>
      <Card 
        title="Din personliga handelsträdgård!"
        backgroundImage={gardenImage}>
        Här hittar ni fantstiskt många olika växter, många fina trädgårdstillbehör och sist men inte minst inspiration och kunskap
      </Card>
      </>
    );
  };
  
  export default GardenShop;
  