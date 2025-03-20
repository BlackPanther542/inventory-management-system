document.addEventListener("DOMContentLoaded", () => {
    const ordersList = document.getElementById("ordersList");
    const orderForm = document.getElementById("orderForm");

    async function fetchOrders() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("❌ You must be logged in!");
                return;
            }

            const response = await fetch("http://localhost:5000/api/orders", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("❌ Failed to fetch orders");
            }

            const orders = await response.json();
            ordersList.innerHTML = "";

            if (orders.length === 0) {
                ordersList.innerHTML = "<p>No orders found.</p>";
            } else {
                orders.forEach(order => {
                    const li = document.createElement("li");
                    li.textContent = `Order ID: ${order._id}, Total: $${order.totalPrice}, Status: ${order.status}`;
                    ordersList.appendChild(li);
                });
            }

        } catch (error) {
            console.error("❌ Error fetching orders:", error);
        }
    }

    orderForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("❌ You must be logged in!");
            return;
        }

        const productId = document.getElementById("productId").value;
        const quantity = parseInt(document.getElementById("quantity").value);
        const totalPrice = parseInt(document.getElementById("totalPrice").value);

        if (!productId || !quantity || !totalPrice) {
            alert("❌ Please fill in all fields.");
            return;
        }

        const newOrder = {
            products: [{ productId, quantity }],
            totalPrice,
            status: "pending"
        };

        try {
            const response = await fetch("http://localhost:5000/api/orders", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newOrder)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "❌ Order placement failed");
            }

            alert("✅ Order placed successfully!");
            fetchOrders();

        } catch (error) {
            console.error("❌ Error placing order:", error);
            alert(error.message);
        }
    });

    fetchOrders();
});
