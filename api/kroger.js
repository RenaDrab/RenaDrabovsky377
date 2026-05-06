export default async function handler(req, res) {
  const response = await fetch("https://api.kroger.com/v1/locations");
  const data = await response.json();

  res.status(200).json(data);
}