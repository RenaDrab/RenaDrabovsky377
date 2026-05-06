import axios from "axios";

export default async function handler(req, res) {
    try {
        const { zipcode, item, category } = req.query;

        if (!zipcode || !item) {
            return res.status(400).json({
                error: "Missing zipcode or item"
            });
        }

        // NOTE: Replace with your real token logic or env variables
        const token = process.env.KROGER_TOKEN;

        if (!token) {
            return res.status(500).json({
                error: "Missing Kroger token"
            });
        }

        // 1. Get store location
        const locationRes = await axios.get(
            "https://api.kroger.com/v1/locations",
            {
                params: {
                    "filter.zipCode.near": zipcode,
                    "filter.limit": 1
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const locationId = locationRes.data?.data?.[0]?.locationId;

        if (!locationId) {
            return res.json({
                products: [],
                message: "No store found"
            });
        }

        // 2. Get products
        const productRes = await axios.get(
            "https://api.kroger.com/v1/products",
            {
                params: {
                    "filter.term": item,
                    "filter.locationId": locationId,
                    "filter.limit": 10
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const products = productRes.data?.data || [];

        // 3. Format data for frontend
        const formatted = products.map(p => {
            const nutrition = p.nutritionInformation?.[0]?.nutrients || [];

            const get = (name) =>
                nutrition.find(n => n.displayName === name)?.quantity || null;

            return {
                product_id: p.productId,
                item_name: p.description,
                brand: p.brand || "Unknown",
                category: p.categories?.[0] || "Unknown",

                calories: get("Calories"),
                sugar: get("Sugar"),
                saturated_fat: get("Saturated Fat"),
                protein: get("Protein"),

                nutritional_rating: p.nutritionalRating || null
            };
        });

        // 4. Send response
        res.status(200).json({
            products: formatted
        });

    } catch (err) {
        console.error(err.response?.data || err.message);

        res.status(500).json({
            error: "Server error",
            details: err.message
        });
    }
}