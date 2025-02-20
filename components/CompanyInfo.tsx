import Image from "next/image";

type Props = {
  visibility: string;
};

export default function CompanyInfo({ visibility }: Props) {
  return (
    <div className={`bg-[#1c1c1c] text-white ${visibility} mt-8`}>
      {/* About Section */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-semibold text-yellow-300">About Us</h2>
            <p className="mt-4 text-lg text-gray-400">
              We are an award-winning architectural firm specializing in
              contemporary, sustainable, and innovative designs that redefine
              spaces and environments.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-[#292929] shadow-md rounded-lg">
              <h3 className="text-2xl font-bold text-yellow-300">50+</h3>
              <p className="text-gray-400">Completed Projects</p>
            </div>
            <div className="p-6 bg-[#292929] shadow-md rounded-lg">
              <h3 className="text-2xl font-bold text-yellow-300">20+</h3>
              <p className="text-gray-400">Years of Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="bg-[#292929] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-yellow-300 text-center">
            Our <span className="text-white">Projects</span>
          </h2>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {/* Project 1 - Modern */}
            <div className="relative group overflow-hidden">
              <Image
                src="/images/modern.jpg"
                className="rounded-lg w-full h-full transition-transform duration-300 group-hover:scale-105"
                width={530}
                height={400}
                alt="Modern"
              />
              <div className="absolute inset-0 bg-[#1c1c1c] bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-yellow-300 font-semibold">Modern</p>
              </div>
            </div>

            {/* Project 2 - Asian */}
            <div className="relative group overflow-hidden">
              <Image
                src="/images/asian.jpg"
                className="rounded-lg w-full h-full transition-transform duration-300 group-hover:scale-105"
                width={530}
                height={400}
                alt="Asian"
              />
              <div className="absolute inset-0 bg-[#1c1c1c] bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-yellow-300 font-semibold">Asian</p>
              </div>
            </div>
            {/* Project 3 - Classic */}
            <div className="relative group overflow-hidden">
              <Image
                src="/images/classic.jpg"
                className="rounded-lg w-full h-full transition-transform duration-300 group-hover:scale-105"
                width={530}
                height={400}
                alt="Classic"
              />
              <div className="absolute inset-0 bg-[#1c1c1c] bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-yellow-300 font-semibold">Classic</p>
              </div>
            </div>
            {/* Add Text in the Empty Space */}
            <div className="flex justify-end items-center pr-12">
              <div className="max-w-md text-right">
                <h2 className="text-3xl font-bold text-yellow-300">
                  Every design tells a story
                </h2>
                <p className="text-gray-400 mt-3 text-lg leading-relaxed">
                  Dive into the elegance of modern, classic, and Asian-inspired
                  architecture. Our designs blend innovation with tradition,
                  creating timeless spaces that inspire
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-semibold text-yellow-300 text-center">
          Our <span className="text-white">Services</span>
        </h2>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#292929] shadow-md rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-300">
              Architecture
            </h3>
            <p className="text-gray-400 mt-2">
              Innovative, functional, and sustainable designs.
            </p>
          </div>
          <div className="p-6 bg-[#292929] shadow-md rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-300">
              Interior Design
            </h3>
            <p className="text-gray-400 mt-2">
              Transforming spaces with elegance and efficiency.
            </p>
          </div>
          <div className="p-6 bg-[#292929] shadow-md rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-300">
              Urban Design
            </h3>
            <p className="text-gray-400 mt-2">
              Planning sustainable and modern urban spaces.
            </p>
          </div>
        </div>
      </section>

      {/* Model creditation */}
      <div className="flex flex-col justify-center items-center mb-8">
        <div>Models of the buildings can be found here:</div>
        <div className="space-y-4">
          <div>
            <div>&quot;Asian&quot;</div>
            <div>
              This work is based on{" "}
              <a
                href="https://sketchfab.com/3d-models/dae-final-assignment-milestone-house-58a9edfc71ab4adc869061d4e5e862d1"
                className="text-yellow-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                &quot;[DAE] Final Assignment Milestone: House&quot;
              </a>{" "}
              by{" "}
              <a
                href="https://sketchfab.com/JoanTieu"
                className="text-yellow-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Joan Tieu
              </a>
              , licensed under{" "}
              <a
                href="http://creativecommons.org/licenses/by/4.0/"
                className="text-yellow-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC-BY-4.0
              </a>
              .
            </div>
          </div>

          <div>
            <div>&quot;Modern&quot;</div>
            <div>
              This work is based on{" "}
              <a
                href="https://sketchfab.com/3d-models/modern-luxury-villa-house-building-with-pool-0e858284939343cb994233d40a48a20a"
                className="text-yellow-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                &quot;Modern luxury villa house building with pool&quot;
              </a>{" "}
              by{" "}
              <a
                href="https://sketchfab.com/saakbary64"
                className="text-yellow-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                saeedakbari
              </a>
              , licensed under{" "}
              <a
                href="http://creativecommons.org/licenses/by/4.0/"
                className="text-yellow-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC-BY-4.0
              </a>
              .
            </div>
          </div>

          <div>
            <div>&quot;Classic&quot;</div>
            <div>
              This work is based on{" "}
              <a
                href="https://sketchfab.com/3d-models/small-brick-house-c9ef0a360eff405682015c8813eee41d"
                className="text-yellow-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                &quot;Small Brick House&quot;
              </a>{" "}
              by{" "}
              <a
                href="https://sketchfab.com/jimbogies"
                className="text-yellow-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                jimbogies
              </a>
              , licensed under{" "}
              <a
                href="http://creativecommons.org/licenses/by/4.0/"
                className="text-yellow-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC-BY-4.0
              </a>
              .
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#121212] text-white py-8 text-center">
        <p>© 2025 SwanSpace. All Rights Reserved.</p>
        <p className="mt-2">
          <a href="#" className="text-yellow-300">
            Privacy Policy
          </a>{" "}
          |
          <a href="#" className="text-yellow-300 mx-2">
            Terms of Service
          </a>{" "}
          |
          <a href="#" className="text-yellow-300">
            Our Commitment to Excellence
          </a>
        </p>
        <p className="font-semibold mt-4">
          Shaping the Future of Architecture. 🏗️
        </p>
      </footer>
    </div>
  );
}
