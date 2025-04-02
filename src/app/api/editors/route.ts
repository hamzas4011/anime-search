import { NextResponse } from "next/server";

export async function GET() {
  const editorsPicks = [
    {
      id: 1,
      title: "Fullmetal Alchemist: Brotherhood",
      image: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg",
      synopsis: "Two brothers search for the Philosopher's Stone after an attempt to revive their mother goes wrong.",
      url: "https://myanimelist.net/anime/5114/Fullmetal_Alchemist__Brotherhood",
    },
    {
      id: 2,
      title: "Attack on Titan",
      image: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
      synopsis: "Humanity fights for survival against gigantic humanoid creatures known as Titans.",
      url: "https://myanimelist.net/anime/16498/Shingeki_no_Kyojin",
    },
    {
      id: 3,
      title: "Demon Slayer",
      image: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
      synopsis: "Tanjiro joins the Demon Slayer Corps to avenge his family and save his sister from a demon curse.",
      url: "https://myanimelist.net/anime/38000/Kimetsu_no_Yaiba",
    },
    {
      id: 4,
      title: "Death Note",
      image: "https://cdn.myanimelist.net/images/anime/9/9453.jpg",
      synopsis: "A student discovers a notebook that kills anyone whose name is written in it.",
      url: "https://myanimelist.net/anime/1535/Death_Note",
    },
    {
      id: 5,
      title: "One Piece",
      image: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
      synopsis: "Luffy sets sail to become the Pirate King with his loyal crew.",
      url: "https://myanimelist.net/anime/21/One_Piece",
    },
    {
      id: 6,
      title: "Steins;Gate",
      image: "https://cdn.myanimelist.net/images/anime/5/73199.jpg",
      synopsis: "A group of friends discover they can send messages back in time and face dark consequences.",
      url: "https://myanimelist.net/anime/9253/Steins_Gate",
    },
    {
      id: 7,
      title: "Your Name",
      image: "https://cdn.myanimelist.net/images/anime/5/87048.jpg",
      synopsis: "Two strangers mysteriously swap bodies and form a deep connection.",
      url: "https://myanimelist.net/anime/32281/Kimi_no_Na_wa",
    },
    {
      id: 8,
      title: "Mob Psycho 100",
      image: "https://cdn.myanimelist.net/images/anime/11/79410.jpg",
      synopsis: "A psychic middle-schooler tries to live a normal life while suppressing his powers.",
      url: "https://myanimelist.net/anime/32182/Mob_Psycho_100",
    },
    {
      id: 9,
      title: "Hunter x Hunter",
      image: "https://cdn.myanimelist.net/images/anime/1337/99013.jpg",
      synopsis: "Gon sets out on a journey to become a Hunter and find his father.",
      url: "https://myanimelist.net/anime/11061/Hunter_x_Hunter_2011",
    },
    {
      id: 10,
      title: "Spirited Away",
      image: "https://cdn.myanimelist.net/images/anime/6/79597.jpg",
      synopsis: "A young girl enters a magical world and must find her way back.",
      url: "https://myanimelist.net/anime/199/Sen_to_Chihiro_no_Kamikakushi",
    },
  ];

  return NextResponse.json(editorsPicks);
}
