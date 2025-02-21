import buildingData from "@/public/json/buildings.json";
import Image from "next/image";

type Props = {
  visibility: string;
  setBuildingModelName: (name: string) => void;
  setHasBuilding: (hasBuilding: boolean) => void;
};

export default function PortfolioList({
  visibility,
  setBuildingModelName,
  setHasBuilding,
}: Props) {
  const isBrowser = () => typeof window !== "undefined"; //The approach recommended by Next.js

  function scrollToTop() {
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  //Get this from json file
  const buildingModelNames = buildingData.buildings;

  return (
    <div className="">
      <div
        className={`w-full h-full flex justify-center mt-16 ${visibility}`}
        id="catalogue"
      >
        <ul className="w-full md:w-[960px] h-auto space-y-12 px-4">
          {/* Mapping Buildings */}
          {buildingModelNames.map((model, k) => (
            <li
              className="flex flex-wrap justify-center py-12 lg:justify-between items-center lg:py-0"
              key={k}
            >
              {/* Background of the image */}
              <div className="bg-yellow-300 rotate-6 w-[300px] h-[300px] md:w-[400px] md:h-[400px] relative -z-50">
                {/* Image placeholder */}
                <Image
                  alt={`${model.name} building`}
                  src={`/images/CatalogImages/${model.name}.png`}
                  width={400}
                  height={400}
                  className="object-fill w-[300px] h-[300px] md:w-[400px] md:h-[400px] -rotate-6"
                />
              </div>
              <div className="w-[300px] md:w-[400px] h-full space-y-4 mt-12 lg:mt-0">
                <h1 className="text-2xl md:text-4xl font-bold text-yellow-300">
                  {model.name}
                </h1>
                <p>{model.description}</p>
                <button
                  className="border-2 border-white px-4 py-2 rounded-md my-2 hover:bg-gradient-to-r from-red-500 to-orange-500 ease-in-out duration-300"
                  value={model.name}
                  onClick={() => {
                    setBuildingModelName(model.name);
                    setHasBuilding(true);
                    scrollToTop();
                  }}
                >
                  Select to view
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
