import React from "react";
import { FaHandHoldingHeart, FaHandHoldingUsd, FaUsers, FaGift } from "react-icons/fa";
import Donation from "../assets/donation.jpg";

const Home = () => {
  return (
    <div className="w-screen min-h-screen overflow-x-hidden mb-20">
      {/* Static Image */}
      <div className="relative w-screen h-screen overflow-x-hidden">
        <img
          src={Donation}
          alt="Donation Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Donation Icons */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-6 text-center">
        <div className="flex flex-col items-center">
          <FaHandHoldingHeart className="text-4xl md:text-5xl text-red-500" />
          <p className="text-sm md:text-lg font-semibold mt-2">Food Donation</p>
        </div>
        <div className="flex flex-col items-center">
          <FaHandHoldingUsd className="text-4xl md:text-5xl text-green-500" />
          <p className="text-sm md:text-lg font-semibold mt-2">Money Donation</p>
        </div>
        <div className="flex flex-col items-center">
          <FaUsers className="text-4xl md:text-5xl text-blue-500" />
          <p className="text-sm md:text-lg font-semibold mt-2">Volunteer</p>
        </div>
        <div className="flex flex-col items-center">
          <FaGift className="text-4xl md:text-5xl text-yellow-500" />
          <p className="text-sm md:text-lg font-semibold mt-2">Gift Donation</p>
        </div>
      </div>

      {/* News Section */}
      <div className="max-w-screen-xl mx-auto p-5 sm:p-8 md:p-12">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
          {/* Main News Item */}
          <div className="sm:col-span-5">
            <a href="#">
              <div
                className="w-full h-64 md:h-72 bg-cover bg-center rounded-lg"
                style={{
                  backgroundImage: "url('https://api.time.com/wp-content/uploads/2020/07/never-trumpers-2020-election-01.jpg?quality=85&w=1201&h=676&crop=1')",
                }}
              ></div>
            </a>
            <div className="mt-3 bg-white p-4 rounded-lg shadow-md">
              <a href="#" className="text-xs text-indigo-600 uppercase font-medium hover:text-gray-900">
                Election
              </a>
              <a href="#" className="block text-gray-900 font-bold text-lg md:text-2xl mb-2 hover:text-indigo-600">
                Revenge of the Never Trumpers
              </a>
              <p className="text-gray-700 text-sm md:text-base mt-2">
                Meet the Republican dissidents fighting to push Donald Trump out of office—and reclaim their party.
              </p>
            </div>
          </div>

          {/* Smaller News Items */}
          <div className="sm:col-span-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                image: "https://api.time.com/wp-content/uploads/2020/07/president-trump-coronavirus-election.jpg?quality=85&w=364&h=204&crop=1",
                title: "Trump Steps Back Into Coronavirus Spotlight",
              },
              {
                image: "https://api.time.com/wp-content/uploads/2020/06/GettyImages-1222922545.jpg?quality=85&w=364&h=204&crop=1",
                title: "How Trump's Mistakes Became Biden's Big Breaks",
              },
              {
                image: "https://api.time.com/wp-content/uploads/2020/07/American-Flag.jpg?quality=85&w=364&h=204&crop=1",
                title: "Survey: Many Americans 'Dissatisfied' With U.S.",
              },
            ].map((news, index) => (
              <div key={index} className="overflow-hidden">
                <a href="#">
                  <div
                    className="h-32 md:h-40 bg-cover bg-center w-full rounded-lg shadow-md"
                    style={{ backgroundImage: `url('${news.image}')` }}
                  ></div>
                </a>
                <a href="#" className="block text-gray-900 font-semibold text-sm md:text-md mt-2 hover:text-indigo-600">
                  {news.title}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
