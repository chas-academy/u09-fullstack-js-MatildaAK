import BookShop from "../../components/BookShop/BookShop";
import GardenShop from "../../components/GardenShop/GardenShop";

const HomePage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <GardenShop/>

      <BookShop/>
    </>
  );
};

export default HomePage;
