import MenyList from "./MenyList";


const Meny = () => {

    const varmrätter = [
        'Bakpotatis med skagenröra',
        'Cheese burgare med pommes',
        'B.L.T',
        'Pannkakor',
      ];
    
      const desserter = [
        'Chokladkaka',
        'Morotskaka',
        'Glass med bär',
        'Pannacotta',
      ];
    return (
        <div className="flex justify-center">
            <div className="bg-primaryLightGreen dark:bg-primaryDarkGreen my-16 w-4/5 md:w-3/5">
                <div className="text-black dark:text-white text-center">
                    <h1 className="text-3xl my-10">Meny</h1>

                <div>
                    <MenyList title="Varmrätter" items={varmrätter} />
                    <MenyList title="Bakverk" items={desserter} />
                </div>

                </div>
            </div>
        </div>
    )
}

export default Meny
