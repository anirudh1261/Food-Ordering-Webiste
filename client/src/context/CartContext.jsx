import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('foodie_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState(() => {
    try {
      const saved = localStorage.getItem('foodie_promo');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('foodie_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedPromo) {
      localStorage.setItem('foodie_promo', JSON.stringify(appliedPromo));
    } else {
      localStorage.removeItem('foodie_promo');
    }
  }, [appliedPromo]);

  // Add item to cart
  const addToCart = (food, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => (item._id || item.id) === (food._id || food.id));
      if (existing) {
        toast.success(`Updated ${food.name} quantity to ${existing.quantity + quantity}`);
        return prevItems.map((item) =>
          (item._id || item.id) === (food._id || food.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        toast.success(`Added ${food.name} to cart!`);
        return [
          ...prevItems,
          {
            _id: food._id || food.id,
            name: food.name,
            price: Number(food.price),
            image: food.image,
            category: food.category,
            isVeg: food.isVeg,
            quantity: quantity,
          },
        ];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        (item._id || item.id) === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => (item._id || item.id) === id);
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.name} from cart`);
      }
      return prevItems.filter((item) => (item._id || item.id) !== id);
    });
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
  };

  // Apply Promo Code
  const applyPromoCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'CRAVE30') {
      const promo = { code: 'CRAVE30', discountPercent: 30, description: '30% Discount' };
      setAppliedPromo(promo);
      toast.success('Promo CRAVE30 applied! 30% discount');
      return { success: true, promo };
    } else if (cleanCode === 'FREESHIP') {
      const promo = { code: 'FREESHIP', freeShipping: true, description: 'Free Delivery' };
      setAppliedPromo(promo);
      toast.success('Promo FREESHIP applied! Free delivery unlocked');
      return { success: true, promo };
    } else if (cleanCode === 'PIZZALOVE') {
      const promo = { code: 'PIZZALOVE', discountAmount: 100, description: '₹100 Off' };
      setAppliedPromo(promo);
      toast.success('Promo PIZZALOVE applied! ₹100 off');
      return { success: true, promo };
    } else {
      toast.error('Invalid promo code. Try CRAVE30 or FREESHIP');
      return { success: false, error: 'Invalid code' };
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    toast.success('Promo code removed');
  };

  // Reorder items from past order
  const reorder = (items) => {
    if (!items || items.length === 0) return;
    setCartItems((prev) => {
      let updated = [...prev];
      items.forEach((newItem) => {
        const id = newItem.foodId || newItem._id || newItem.id;
        const exists = updated.find((i) => (i._id || i.id) === id);
        if (exists) {
          exists.quantity += newItem.quantity || 1;
        } else {
          updated.push({
            _id: id,
            name: newItem.name,
            price: Number(newItem.price),
            image: newItem.image,
            category: newItem.category || 'General',
            isVeg: newItem.isVeg ?? true,
            quantity: newItem.quantity || 1,
          });
        }
      });
      return updated;
    });
    toast.success('Items added to cart from previous order!');
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Delivery fee calculation in Rupees
  let deliveryFee = subtotal === 0 ? 0 : subtotal >= 499 ? 0 : 49;
  if (appliedPromo?.freeShipping) {
    deliveryFee = 0;
  }

  // Discount calculation
  let discount = 0;
  if (appliedPromo?.discountPercent) {
    discount = Math.round((subtotal * appliedPromo.discountPercent) / 100);
  } else if (appliedPromo?.discountAmount) {
    discount = Math.min(subtotal, appliedPromo.discountAmount);
  }

  // Estimated tax & packaging in Rupees (5%)
  const tax = subtotal === 0 ? 0 : Math.round(subtotal * 0.05);
  const totalAmount = Math.max(0, subtotal - discount + deliveryFee + tax);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const getItemQuantity = (id) => {
    const item = cartItems.find((i) => (i._id || i.id) === id);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        reorder,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        subtotal,
        deliveryFee,
        discount,
        tax,
        totalAmount,
        totalItemsCount,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
