type Props = {
  visibility: String;
};

export default function PortfolioList(props: Props) {
  return (
    <div>
      <div
        className={`w-full h-full flex justify-center mt-16 ${props.visibility}`}
        id="catalogue"
      >
        <ul className="w-[960px] h-auto space-y-12">
          {/* Item 1 */}
          <li className="flex justify-between items-center">
            {/* Background of the image */}
            <div className="bg-yellow-300 rotate-12 w-[400px] h-[400px] relative">
              {/* Image placeholder */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl  -rotate-12 w-[400px] h-[400px] absolute"></div>
            </div>
            <div className="w-[400px] h-full space-y-4">
              <h1 className="text-4xl font-bold">Title of the Building</h1>
              <p>
                This is the description of the buildin It is a long established
                fact that a reader will be distracted by the readable content of
                a page when looking at its layout.{" "}
              </p>
              <button className="border-2 border-white px-4 py-2 rounded-md my-2 hover:bg-yellow-300 ease-in-out duration-300">
                Select to view
              </button>
            </div>
          </li>

          {/* Item 2 */}
          <li className="flex justify-between items-center">
            {/* Background of the image */}
            <div className="bg-yellow-300 rotate-12 w-[400px] h-[400px] relative">
              {/* Image placeholder */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl  -rotate-12 w-[400px] h-[400px] absolute"></div>
            </div>
            <div className="w-[400px] h-full space-y-4">
              <h1 className="text-4xl font-bold">Title of the Building</h1>
              <p>
                This is the description of the buildin It is a long established
                fact that a reader will be distracted by the readable content of
                a page when looking at its layout.{" "}
              </p>
              <button className="border-2 border-white px-4 py-2 rounded-md my-2 hover:bg-yellow-300 ease-in-out duration-300">
                Select to view
              </button>
            </div>
          </li>

          {/* Item 3 */}
          <li className="flex justify-between items-center">
            {/* Background of the image */}
            <div className="bg-yellow-300 rotate-12 w-[400px] h-[400px] relative">
              {/* Image placeholder */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl  -rotate-12 w-[400px] h-[400px] absolute"></div>
            </div>
            <div className="w-[400px] h-full space-y-4">
              <h1 className="text-4xl font-bold">Title of the Building</h1>
              <p>
                This is the description of the buildin It is a long established
                fact that a reader will be distracted by the readable content of
                a page when looking at its layout.{" "}
              </p>
              <button className="border-2 border-white px-4 py-2 rounded-md my-2 hover:bg-yellow-300 ease-in-out duration-300">
                Select to view
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
