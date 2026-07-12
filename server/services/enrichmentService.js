import stringSimilarity from "string-similarity";

export const matchPlaceData = (activityName, retrievedPlaces) => {
  const names = retrievedPlaces.map((p) => p.name);
  const { bestMatch, bestMatchIndex } = stringSimilarity.findBestMatch(activityName, names);

  if (bestMatch.rating < 0.3) {
    return null; // too dissimilar, no confident match
  }

  return retrievedPlaces[bestMatchIndex];
};

export const enrichItinerary = (itinerary, retrievedPlaces) => {
  const enrichedDays = itinerary.days.map((day) => {
    const enrichedActivities = day.activities.map((activity) => {
      const match = matchPlaceData(activity.name, retrievedPlaces);

      return {
        ...activity,
        lat: match?.lat || null,
        long: match?.long || null,
        image: null, // filled in next step
      };
    });

    return { ...day, activities: enrichedActivities };
  });

  return { ...itinerary, days: enrichedDays };
};