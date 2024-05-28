import { getTheatrePieces } from "./_actions/webscrapper";

export default async  function Home() {
  const {success, theatrePieces, message} = await getTheatrePieces("https://www.theatre-classique.fr/pages/programmes/PageEdition.php");
  console.log("theatre pieces", theatrePieces);  

  if (!success){
    return (
      <p className="text-red-400">{message}</p>
    )
  }
  return (
    <main>
      <p>Hello world</p>
    </main>
  );
}
