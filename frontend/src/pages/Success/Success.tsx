import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../Context/ShopContext";
import BASE_URL from "../../config";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

const Success = () => {
    const [isProcessing, setIsProcessing] = useState(true);
	const { clearCart } = useContext(ShopContext);
	const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate()

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
        <div className="text-black dark:text-white text-center mt-20">
            <h1 className="text-xl font-semibold mb-4">Tack för ditt köp!</h1>
            <p>Din betalning har genomförts.</p>

            <Button type={"button"} variant="secondary" size="small" onClick={() => navigate('/')}>Tillbaks till webshoppen</Button>
        </div>
    )
}

export default Success
