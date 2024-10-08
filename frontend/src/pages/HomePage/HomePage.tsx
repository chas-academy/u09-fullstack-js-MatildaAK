import About from "../../components/Home/About/About";
import BookShop from "../../components/Home/BookShop/BookShop";
import CoffeeInfo from "../../components/Home/CoffeeInfo/CoffeeInfo";
import GardenShop from "../../components/Home/GardenShop/GardenShop";
import gardenImg from "../../assets/images/garden.jpg";

const HomePage = () => {
  return (
    <>

    <img src={gardenImg} alt="Bild på trädgård" className="h-[250px] md:h-[400px] w-full object-cover" />

      <GardenShop/>

      <About/>

      <CoffeeInfo/>

      <BookShop/>
    </>
  );
};

export default HomePage;
