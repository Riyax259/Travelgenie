import axios from "axios";

const WIKI_API = "https://en.wikipedia.org/w/api.php";

export const getImageForPlace = async (placeName) => {
  try {
    const res = await axios.get(WIKI_API, {
      params: {
        action: "query",
        titles: placeName,
        prop: "pageimages",
        format: "json",
        pithumbsize: 500,
        redirects: 1,
      },
    });

    const pages = res.data.query.pages;
    const page = Object.values(pages)[0];

    if (page && page.thumbnail) {
      return page.thumbnail.source;
    }

    return null;
  } catch (error) {
    return null; // fail silently, fallback handled by caller
  }
};

export const attachImages = async (itinerary) => {
  const days = await Promise.all(
    itinerary.days.map(async (day) => {
      const activities = await Promise.all(
        day.activities.map(async (activity) => {
          const image = await getImageForPlace(activity.name);
          return {
            ...activity,
            image: image || null, // frontend shows a placeholder illustration if null
          };
        })
      );
      return { ...day, activities };
    })
  );

  return { ...itinerary, days };
};