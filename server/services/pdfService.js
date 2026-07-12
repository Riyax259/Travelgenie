import PDFDocument from "pdfkit";

export const generateItineraryPDF = (trip, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${trip.tripProfile.destination}-itinerary.pdf`
  );

  doc.pipe(res);

  // Title
  doc
    .fontSize(24)
    .fillColor("#1A2129")
    .text(trip.itinerary.tripSummary.destination, { align: "center" });

  doc
    .fontSize(12)
    .fillColor("#5F5E5A")
    .text(`${trip.itinerary.tripSummary.totalDays} days`, { align: "center" });

  doc.moveDown();
  doc
    .fontSize(11)
    .fillColor("#444441")
    .text(trip.itinerary.tripSummary.vibe, { align: "center" });

  doc.moveDown(2);

  // Each day
  trip.itinerary.days.forEach((day) => {
    doc
      .fontSize(16)
      .fillColor("#E8834E")
      .text(`Day ${day.day}: ${day.theme}`);

    doc.moveDown(0.5);

    day.activities.forEach((activity) => {
      doc
        .fontSize(12)
        .fillColor("#1A2129")
        .text(`${activity.time} — ${activity.name}`, { continued: false });

      doc
        .fontSize(10)
        .fillColor("#5F5E5A")
        .text(activity.description);

      doc.moveDown(0.5);
    });

    doc.moveDown(1);
  });

  doc.end();
};