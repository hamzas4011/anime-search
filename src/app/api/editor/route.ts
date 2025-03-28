import { NextResponse } from "next/server";

export async function GET() {
  const editorsPicks = [
    {
      id: 1,
      title: "Fullmetal Alchemist: Brotherhood",
      image: "/images/fma.jpg",
      synopsis: "Two brothers search for the Philosopher's Stone after an attempt to revive their mother goes wrong.",
      url: "https://myanimelist.net/anime/5114/Fullmetal_Alchemist__Brotherhood",
    },
    {
      id: 2,
      title: "Attack on Titan",
      image: "/images/aot.jpg",
      synopsis: "Humanity fights for survival against gigantic humanoid creatures known as Titans.",
      url: "https://myanimelist.net/anime/16498/Shingeki_no_Kyojin",
    },
  ];

  return NextResponse.json(editorsPicks);
}
