import About from "../../components/Home/About/About";
import BookShop from "../../components/Home/BookShop/BookShop";
import CoffeeInfo from "../../components/Home/CoffeeInfo/CoffeeInfo";
import GardenShop from "../../components/Home/GardenShop/GardenShop";

const HomePage = () => {
  return (
    <>
      <GardenShop/>

      <About/>

      <CoffeeInfo/>

      <BookShop/>
    </>
  );
};

export default HomePage;
