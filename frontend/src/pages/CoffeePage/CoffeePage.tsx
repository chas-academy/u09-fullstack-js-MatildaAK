import coffee from "../../assets/images/coffee.svg";
import Meny from "../../components/Meny/Meny";

const CoffeePage = () => {
    return (
      <>
      <img src={coffee} alt="Kaffe kopp med svart kaffe och macrones" className="h-[250px] md:h-[400px] w-full object-cover" />
        {/* <h1 className="text-base md:text-3xl text-center font-bold underline text-black dark:text-white my-8">Välkommen in på en kaffe i MJs café</h1> */}

        <Meny />
      </>
    );
  };
  
  export default CoffeePage;
  