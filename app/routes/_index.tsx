/* eslint-disable react/jsx-no-target-blank */
import { json, type MetaFunction, type LinksFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { kv } from "@vercel/kv";


import styles from "./index.css?url";


export const meta: MetaFunction = () => {
  return [
    { title: "Pleut-il en Bretagne" },
    { name: "description", content: "Un site tout bête qui répond simplement à la question : \"Pleut-il en Bretagne ?\"" },
    {name: "og:title", content: "Pleut-il en Bretagne ?"},
    {name: "og:description", content: "Un site tout bête qui répond simplement à la question \"Pleut-il en Bretagne ?\""}
  ];
};

export const links: LinksFunction = () => [
  {rel: "stylesheet", href: styles}

]

export async function loader() {
    const serverCache = await kv.get<{isRaining: boolean, last_updated: number, rainOccurencesBzh: number, rainOccurencesNmd: number}>('weather')
    if(serverCache != null) {
      return json({isRaining: serverCache.isRaining, source: "server cache", rainOccurencesBzh: serverCache.rainOccurencesBzh, rainOccurencesNmd: serverCache.rainOccurencesNmd}, 200);
    } 

 
  }

export default function Index() {
  return (
    <div style={{ fontFamily: "Roboto, sans-serif"}}>
      <div style={{fontSize: "10vw", display: 'flex', alignItems: 'center', justifyContent: 'center', height: "100vh", backgroundImage: "url('https://source.unsplash.com/random?Bretagne,Morbihan,Finistere')", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center",   backgroundAttachment: "fixed"}}>
        <div style={{fontSize: "10vw", display: 'flex', alignItems: 'center', justifyContent: 'center', height: "115vh", width: "100vw", backdropFilter: "blur(15px)"}}>
        <h1 style={{color: "white", marginBottom: "15vh", marginTop: "0vh", textShadow: "#ffffff 1px 0 10px"}}>{useLoaderData<typeof loader>().isRaining ? "OUI." : "NON."}</h1>
        </div>
      </div>
      <div style={{marginTop: "10vh", display:"flex", justifyContent: "center", alignItems: "center", flexDirection: "column", }}>
        <h1 style={{margin: "0.2em"}}>{useLoaderData<typeof loader>().isRaining ? "Il pleut en ce moment en Bretagne!" : "Pas de pluie en ce moment en Bretagne!"}</h1>
        <p>Ce résultat est basé sur les observations en temps réel de stations météos au centre de la région Bretagne.<br/>
        Les informations météorologiques proviennent de <a href={"https://openweathermap.org/"} target={"_blank"} rel={"norefferer"} >OpenWeatherMap</a> & le code source est disponible sur <a href={"https://github.com/alexis-lcbc/BrittanyRainWatcher"} target={"_blank"} rel={"norefferer noreferrer"} >Github</a><br/>
        Il peut donc être légèrement faussé ou un peu en retard mais donne une idée générale de la météo en ce moment.</p>
        <p>Consultez la météo de la Bretagne sur <a href="https://meteofrance.com/previsions-meteo-france/bretagne/5">MétéoFrance</a>.</p>
        
        <h1 style={{margin: "0.2em"}}>Données historiques :</h1>
        <p>Il y a plu {useLoaderData<typeof loader>().rainOccurencesBzh || 0} fois ce mois-ci en Bretagne et {useLoaderData<typeof loader>().rainOccurencesNmd || 0} fois en Normandie.</p>
        <footer style={{borderTop: "2px black dotted", width: "100%", textAlign: "center"}}>
        <p>Copyright ©️ 2024 - Alexis LE CABELLEC | Tous droits réservés</p>
        </footer>
      </div>
    </div>
  );
}
