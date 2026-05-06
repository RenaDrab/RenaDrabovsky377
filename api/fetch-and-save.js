import axios from "axios";

export default async function handler(req, res) {
    try {
        const { zipcode, item } = req.query;

        if (!zipcode || !item) {
            return res.status(400).json({
                error: "Missing zipcode or item"
            });
        }

        // STEP 1: get token INSIDE function (IMPORTANT)
        const tokenRes = await axios.post(
            "https://api.kroger.com/v1/connect/oauth2/token",
            "grant_type=client_credentials&scope=product.compact",
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization:
                        "Basic " +
                        Buffer.from(
                            process.env.KROGER_CLIENT_ID +
                            ":" +
                            process.env.KROGER_CLIENT_SECRET
                        ).toString("base64")
                }
            }
        );

        const token = tokenRes.data.access_token;

        // STEP 2: get store
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
            return res.json({ products: [] });
        }

        // STEP 3: get products
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

        res.status(200).json({
            products: products.map(p => ({
                product_id: p.productId,
                item_name: p.description,
                brand: p.brand || "Unknown",
                category: p.categories?.[0] || "Unknown",
                calories: null,
                nutritional_rating: null
            }))
        });

    } catch (err) {
        console.log("ERROR:", err.response?.data || err.message);

        res.status(500).json({
            error: "Server error",
            details: err.message
        });
    }
}