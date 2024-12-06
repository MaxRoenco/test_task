async function getData(url, cityId, foodTypeId) {
  try {
    const response = await strapi.query("image").find({
      where: { city: cityId, foodType: foodTypeId },
      populate: true,
    });
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

console.log(getData())