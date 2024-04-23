import { json, type MetaFunction, type LinksFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import styles from "./index.css?url";


export const meta: MetaFunction = () => {
  return [
    { title: "Pleut-il en Bretagne" },
    { name: "description", content: "Un site tout bête qui répond simplement à la question : \"Pleut-il en Bretagne ?\"" },
  ];
};

export const links: LinksFunction = () => [
  {rel: "stylesheet", href: styles}

]

export async function loader() {
  const coordinates = {lat: 48.168656, lon: -2.966861}
  const request = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${process.env.OPENWEATHERMAP_KEY}`)
  const answers = await request.json()
  request.headers.set("Cache-Control", "max-age=3600")
  return json({isRaining: answers.weather.main == "Thunderstorm" || answers.weather.main == "Drizzle" || answers.weather.main == "Rain"}, 200);
}

export default function Index() {
  return (
    <div style={{ fontFamily: "Roboto, sans-serif"}}>
      <div style={{fontSize: "10vw", display: 'flex', alignItems: 'center', justifyContent: 'center', height: "100vh", backgroundImage: "url('https://source.unsplash.com/random?Bretagne,Morbihan,Finistere')", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center"}}>
        <div style={{fontSize: "10vw", display: 'flex', alignItems: 'center', justifyContent: 'center', height: "115vh", width: "100vw", backdropFilter: "blur(15px)"}}>
        <h1 style={{color: "white", marginBottom: "15vh", marginTop: "0vh", textShadow: "#ffffff 1px 0 10px"}}>{useLoaderData<typeof loader>() ? "NON." : "OUI."}</h1>
        </div>
      </div>
      <div style={{marginTop: "10vh", display:"flex", justifyContent: "center", alignItems: "center", flexDirection: "column", }}>
        <h1 style={{margin: "0.2em"}}>{useLoaderData<typeof loader>() ? "Pas de pluie en ce moment en Bretagne!" : "Il pleut en ce moment en Bretagne!"}</h1>
        <p>Ce résultat est basé sur les observations en temps réel de stations météos au centre de la région Bretagne.<br/>
        Il peut donc être légèrement faussé ou un peu en retard mais donne une idée générale de la météo en ce moment.</p>
        <p>Consultez la météo de la Bretagne sur <a style={{color: "teal"}} href="https://meteofrance.com/previsions-meteo-france/bretagne/5">MétéoFrance</a>.</p>
        <footer style={{borderTop: "2px black dotted", width: "100%", textAlign: "center"}}>
        <p>Copyright ©️ 2024 - Alexis LE CABELLEC | Tous droits réservés</p>
        </footer>
      </div>
    </div>
  );
}
