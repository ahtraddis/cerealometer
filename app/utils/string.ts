/**
 * String utils
 */

/**
 * Encode email address to use as key in Firebase Realtime Database
 *
 * @param email Email address
 */
const firebaseEncodeEmail = (email: string) => {
  const encoded = encodeURIComponent(email).replace('.', ',');
  // return double-encoded value to convert '%' to '%25'
  return encodeURIComponent(encoded)
}

/**
 * Generate random cereal name for sample item definitions
 */
const generateRandomCerealData = () => {
  const adjectives = ["Crunchy", "Salty", "Sugar Frosted", "Sticky", "Gooey", "Crispy", "Rolled", "Gummy", "Marshmallowy", "Chocolatey", "Fruity", "Peanuty", "Corny", "Honey Coated"]
  const subjects = ["Fruit", "Pecan", "Peanut", "Fig", "Graham", "Rice", "Corn", "Marshmallow", "Chocolate"]
  const types = ["Clusters", "Sticks", "Squares", "Pieces", "Bears", "Loops", "Rings", "Balls", "Bombs"]

  const rand = (myArray) => {
    return myArray[Math.floor(Math.random() * myArray.length)];
  }
  return rand(adjectives) + " " + rand(subjects) + " " + rand(types)
}
