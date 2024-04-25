import { LoaderFunctionArgs, json } from "@remix-run/node";
import { kv } from "@vercel/kv";

// This function can run for a maximum of 5 seconds
export const config = {
    maxDuration: 5,
  };


  export async function loader({request}: LoaderFunctionArgs) {
    console.log("[CRON JOBS] Month Stats ran")
    if(request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
      return json({status: "error", message: "Access denied : invalid/missing credentials."}, 401)
    }
    // Brittany weather collection
    const bzh = {lat: 48.168656, lon: -2.966861}
    const bzhRqst = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${bzh.lat}&lon=${bzh.lon}&appid=${process.env.OPENWEATHERMAP_KEY}`)
    const bzhAsw = await bzhRqst.json()
    const bzhRain = bzhAsw.weather.main == "Thunderstorm" || bzhAsw.weather.main == "Drizzle" || bzhAsw.weather.main == "Rain"
    const serverData = await kv.get<{isRaining: boolean, last_updated: number, rainOccurencesBzh: number, rainOccurencesNmd: number, lastExecMonth: number}>('weather')
    
    if(bzhRain && serverData != null) {

      serverData.rainOccurencesBzh += 1
    }

    // Normandy weather collection
    const nmd = {lat: 49.220917, lon: 0.354484}
    const nmdRqst = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${nmd.lat}&lon=${nmd.lon}&appid=${process.env.OPENWEATHERMAP_KEY}`)
    const nmdAsw = await nmdRqst.json()
    const nmdRain = nmdAsw.weather.main == "Thunderstorm" || nmdAsw.weather.main == "Drizzle" || nmdAsw.weather.main == "Rain"
    
    if(nmdRain && serverData != null) {
      serverData.rainOccurencesNmd += 1
    }

    if(serverData != null) {
      if(serverData.rainOccurencesBzh == undefined) {
        serverData.rainOccurencesBzh = 0
      }
      if(serverData.rainOccurencesNmd == undefined) {
        serverData.rainOccurencesNmd = 0
      }
      serverData.lastExecMonth = (new Date()).getMonth()
      serverData.last_updated = Date.now()
    }
    try {
       console.log(serverData)
      kv.set('weather', serverData)

    } catch (error) {
      return json({status: "error", message: "Couldn't set 'weather' key in Redis"}, 500)

    }
    return json({status: "success", message: "Stats updated"}, 200)

  }