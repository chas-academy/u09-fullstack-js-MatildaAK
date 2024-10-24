import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../Context/ShopContext";
import BASE_URL from "../../config";
import { Link } from "react-router-dom";

const Success = () => {
    const [isProcessing, setIsProcessing] = useState(true);
	const { clearCart } = useContext(ShopContext);
	const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCheckoutSuccess = async (sessionId: string) => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${BASE_URL}/betalning/checkout-success`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ sessionId }),
                });
    
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
    
                await response.json();
    
                clearCart();
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsProcessing(false);
            }
        };
    
        const sessionId = new URLSearchParams(window.location.search).get("session_id");
        if (sessionId) {
            handleCheckoutSuccess(sessionId);
        } else {
            setIsProcessing(false);
            setError("No session ID found in the URL");
        }
    }, [clearCart]);

    if (isProcessing) return "Processing...";

	if (error) return `Error: ${error}`;

    return (
        <div className="text-black dark:text-white">
            <h1>Tack för ditt köp!</h1>
            <p>Din betalning har genomförts. Du kommer att få en bekräftelse via e-post.</p>

            <Link to={"/"}>Tillbaks till webshoppen</Link>
        </div>
    )
}

export default Success
