import axios from "axios";

const BASE_URL = "https://api.opentripmap.com/0.1/en/places";

const CATEGORY_MAP = {
  cultural: "history_culture",
  historic: "history_culture",
  architecture: "history_culture",
  religion: "history_culture",
  museums: "history_culture",
  foods: "food",
  natural: "nature",
  beaches: "nature",
  amusements: "adventure_sports",
  sport: "adventure_sports",
  shops: "shopping",
  adult: "nightlife",
};

const mapCategory = (kinds) => {
  const kindList = kinds.split(",");
  for (const kind of kindList) {
    if (CATEGORY_MAP[kind]) return CATEGORY_MAP[kind];
  }
  return "other";
};

export const getCityCoordinates = async (destination) => {
  const res = await axios.get(`${BASE_URL}/geoname`, {
    params: { name: destination, apikey: process.env.OPENTRIPMAP_KEY },
  });
  return { lat: res.data.lat, lon: res.data.lon };
};

export const getNearbyPlaces = async (lat, lon) => {
  const res = await axios.get(`${BASE_URL}/radius`, {
    params: {
      radius: 12000,
      lon,
      lat,
      kinds: "cultural,historic,foods,natural,amusements,shops",
      limit: 40,
      rate: 2,
      format: "json",
      apikey: process.env.OPENTRIPMAP_KEY,
    },
  });

  return res.data.map((place) => ({
    name: place.name,
    xid: place.xid,
    lat: place.point.lat,
    long: place.point.lon,
    category: mapCategory(place.kinds),
  }));
};

export const getPlacesForDestination = async (destination) => {
  const { lat, lon } = await getCityCoordinates(destination);
  const places = await getNearbyPlaces(lat, lon);
  return places.filter((p) => p.name && p.name.trim().length > 0);
};