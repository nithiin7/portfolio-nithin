export const getExperience = startDate => {
  const currentDate = new Date();
  const startDateObj = new Date(startDate);
  let yearDiff =
    currentDate.getFullYear() - startDateObj.getFullYear();
  let monthDiff =
    currentDate.getMonth() - startDateObj.getMonth();
  let experience = "";

  if (monthDiff < 0) {
    yearDiff--;
    monthDiff += 12;
  }

  if (yearDiff > 0) {
    experience += yearDiff + " year";
    if (yearDiff > 1) {
      experience += "s";
    }
  }

  if (monthDiff > 0) {
    if (experience.length > 0) {
      experience += " ";
    }
    experience += monthDiff + " month";
    if (monthDiff > 1) {
      experience += "s";
    }
  }

  return experience;
};
