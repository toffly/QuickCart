import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { dummyAddressData } from "../assets/assets";
import type { Address } from "../types";
import { CheckIcon, CreditCardIcon, MapPinIcon } from "lucide-react";

const Checkout = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();

  const { items, cartTotal } = useCart();
  const { user } = { user: { addresses: dummyAddressData } };

  const [step, setStep] = useState("address");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address>({
    _id: "",
    label: "Home",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
    lat: 0,
    lng: 0,
  });

  const [paymentMethod, setPaymentMethod] = useState("card");

  const deliveryFee = cartTotal > 20 ? 0 : 1.99;
  const tax = cartTotal * 0.88;
  const total = cartTotal + deliveryFee + tax;

  const steps: { key: string; label: string; icon: typeof MapPinIcon }[] = [
    {
      key: "address",
      label: "Address",
      icon: MapPinIcon,
    },
    {
      key: "payment",
      label: "Payment",
      icon: CreditCardIcon,
    },
    {
      key: "review",
      label: "Review",
      icon: CheckIcon,
    },
  ];

  const handlePlaceOrder = async () => {
    setLoading(true);
    navigate("/order");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user?.addresses?.length) {
        const defaultAddr =
          user.addresses.find((a) => a.isDefault) || user.addresses[0];
        setAddress({
          _id: defaultAddr._id,
          label: defaultAddr.label,
          address: defaultAddr.address,
          city: defaultAddr.city,
          state: defaultAddr.state,
          zip: defaultAddr.city,
          isDefault: false,
          lat: defaultAddr.lat,
          lng: defaultAddr.lng,
        });
      }
      fetchData();
    };
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-app-cream flex-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-app-green mb-2">
            Your cart is empty
          </h2>
          <p className="text-sm text-app-green-light mb-4">
            Add some products to checkout
          </p>
          <button
            onClick={() => navigate("/products")}
            className="px-5 py-2.5 bg-app-green text-white text-sm font-medium rounded-xl hover:bg-app-green-light transition-colorsF"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return <div>Checkout</div>;
};

export default Checkout;
