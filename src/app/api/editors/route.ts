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
  ];

  return NextResponse.json(editorsPicks);
}
