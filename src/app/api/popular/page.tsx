import React from "react";

const PopularPage = () => {
  const popularAnime = [
    { id: 1, title: "Attack on Titan" },
    { id: 2, title: "Demon Slayer" },
    { id: 3, title: "One Piece" },
    { id: 4, title: "Jujutsu Kaisen" }
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center my-4">Popular Anime</h1>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {popularAnime.map((anime) => (
          <li
            key={anime.id}
            className="p-4 bg-gray-800 text-white rounded-lg shadow-md text-center"
          >
            {anime.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularPage;
