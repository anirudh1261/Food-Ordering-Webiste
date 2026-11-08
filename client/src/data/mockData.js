export const initialCategories = [
  {
    _id: "cat_1",
    name: "Burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80",
    description: "Juicy, flame-grilled artisan burgers with secret sauces"
  },
  {
    _id: "cat_2",
    name: "Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80",
    description: "Wood-fired stone baked pizzas loaded with authentic cheese"
  },
  {
    _id: "cat_3",
    name: "Asian & Bowls",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80",
    description: "Aromatic noodle bowls, ramen, and wok-tossed stir fry"
  },
  {
    _id: "cat_4",
    name: "Biryani & Rice",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80",
    description: "Royal slow-cooked dum biryanis infused with fragrant spices"
  },
  {
    _id: "cat_5",
    name: "Desserts & Cakes",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80",
    description: "Decadent handcrafted pastries, brownies and ice creams"
  },
  {
    _id: "cat_6",
    name: "Healthy & Salads",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80",
    description: "Fresh farm-to-table crisp greens, poke and superfood bowls"
  },
  {
    _id: "cat_7",
    name: "Beverages & Shakes",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80",
    description: "Chilled mocktails, boba teas and rich artisan milkshakes"
  },
  {
    _id: "cat_8",
    name: "Tacos & Mexican",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=500&q=80",
    description: "Crispy tacos, cheesy quesadillas, and zesty guacamole"
  }
];

export const initialFoods = [
  {
    _id: "food_1",
    name: "Truffle Mushroom Angus Burger",
    description: "Flame-broiled prime Angus patty topped with sautéed wild portobello mushrooms, black truffle aioli, aged Swiss cheese on a toasted brioche bun.",
    price: 349,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    category: "Burgers",
    isVeg: false,
    rating: 4.8,
    numReviews: 240,
    available: true,
    prepTime: "20-25 mins",
    calories: "680 kcal"
  },
  {
    _id: "food_2",
    name: "Neapolitan Margherita Pizza",
    description: "Classic San Marzano tomato sauce, fresh mozzarella di bufala, torn sweet basil leaves, and a drizzle of extra virgin olive oil.",
    price: 399,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80",
    category: "Pizza",
    isVeg: true,
    rating: 4.9,
    numReviews: 310,
    available: true,
    prepTime: "15-20 mins",
    calories: "550 kcal"
  },
  {
    _id: "food_3",
    name: "Smoked Pepperoni Feast Pizza",
    description: "Loaded edge-to-edge with spicy double pepperoni, whole milk mozzarella, cracked black pepper, and chili-infused wildflower honey.",
    price: 449,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    category: "Pizza",
    isVeg: false,
    rating: 4.7,
    numReviews: 185,
    available: true,
    prepTime: "20-25 mins",
    calories: "720 kcal"
  },
  {
    _id: "food_4",
    name: "Spicy Tokyo Shoyu Ramen",
    description: "Silky 12-hour pork and chicken broth, tender chashu pork belly, marinated ramen egg, scallions, nori seaweed, and artisanal ramen noodles.",
    price: 389,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    category: "Asian & Bowls",
    isVeg: false,
    rating: 4.9,
    numReviews: 420,
    available: true,
    prepTime: "15-20 mins",
    calories: "620 kcal"
  },
  {
    _id: "food_5",
    name: "Avocado & Crispy Tofu Poke Bowl",
    description: "Organic Japanese sushi rice, marinated crispy golden tofu, sliced Hass avocado, edamame, pickled ginger, radish, and spicy sesame ponzu.",
    price: 329,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    category: "Healthy & Salads",
    isVeg: true,
    rating: 4.6,
    numReviews: 140,
    available: true,
    prepTime: "10-15 mins",
    calories: "480 kcal"
  },
  {
    _id: "food_6",
    name: "Royal Dum Chicken Biryani",
    description: "Basmati rice layered with succulent saffron chicken, caramelized onions, mint, kewra water, served with cucumber raita and mirchi ka salan.",
    price: 399,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    category: "Biryani & Rice",
    isVeg: false,
    rating: 4.9,
    numReviews: 530,
    available: true,
    prepTime: "25-30 mins",
    calories: "750 kcal"
  },
  {
    _id: "food_7",
    name: "Crispy Buffalo Chicken Burger",
    description: "Double buttermilk fried chicken breast tossed in tangy Nashville hot sauce, crunchy jalapeño slaw, house pickles, and cool ranch dressing.",
    price: 299,
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80",
    category: "Burgers",
    isVeg: false,
    rating: 4.8,
    numReviews: 290,
    available: true,
    prepTime: "15-20 mins",
    calories: "640 kcal"
  },
  {
    _id: "food_8",
    name: "Paneer Tikka Charcoal Roll",
    description: "Smoky tandoor-roasted cottage cheese cubes wrapped in flaky buttery paratha with mint chutney, crisp bell peppers, and chaat masala.",
    price: 249,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    category: "Biryani & Rice",
    isVeg: true,
    rating: 4.7,
    numReviews: 175,
    available: true,
    prepTime: "15-20 mins",
    calories: "510 kcal"
  },
  {
    _id: "food_9",
    name: "Baja Grilled Fish Tacos",
    description: "Three corn tortillas with blackened mahi-mahi, shaved purple cabbage, pico de gallo, pickled jalapeño, and chipotle lime crema.",
    price: 349,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    category: "Tacos & Mexican",
    isVeg: false,
    rating: 4.8,
    numReviews: 210,
    available: true,
    prepTime: "15-18 mins",
    calories: "460 kcal"
  },
  {
    _id: "food_10",
    name: "Warm Belgian Molten Lava Cake",
    description: "Rich dark chocolate sponge with an oozing warm chocolate ganache center, topped with Madagascar vanilla bean ice cream and cocoa dust.",
    price: 199,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    category: "Desserts & Cakes",
    isVeg: true,
    rating: 4.9,
    numReviews: 380,
    available: true,
    prepTime: "10-12 mins",
    calories: "430 kcal"
  },
  {
    _id: "food_11",
    name: "Berry Basil Sparkling Refresher",
    description: "Hand-muddled fresh wild blackberries, strawberries, fragrant sweet basil, fresh lime juice, sparkling soda, and crushed ice.",
    price: 149,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    category: "Beverages & Shakes",
    isVeg: true,
    rating: 4.6,
    numReviews: 95,
    available: true,
    prepTime: "5 mins",
    calories: "120 kcal"
  },
  {
    _id: "food_12",
    name: "Garden Harvest Green Goddess Salad",
    description: "Crisp romaine, baby kale, Persian cucumbers, avocado, toasted pumpkin seeds, crumbled goat cheese, and house green goddess herb dressing.",
    price: 269,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    category: "Healthy & Salads",
    isVeg: true,
    rating: 4.7,
    numReviews: 130,
    available: true,
    prepTime: "10 mins",
    calories: "340 kcal"
  }
];

export const restaurants = [
  {
    id: "r1",
    name: "The Urban Grill House",
    cuisine: "American • Burgers • Steaks",
    rating: 4.8,
    deliveryTime: "25-30 min",
    discount: "20% OFF up to ₹100",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    badge: "Top Rated"
  },
  {
    id: "r2",
    name: "Bella Bella Pizzeria",
    cuisine: "Italian • Artisan Pizza • Pasta",
    rating: 4.9,
    deliveryTime: "20-25 min",
    discount: "Free Garlic Bread",
    image: "https://images.unsplash.com/photo-1579684947550-22e945225d9a?auto=format&fit=crop&w=600&q=80",
    badge: "Trending"
  },
  {
    id: "r3",
    name: "Spice Symphony & Dum Biryani",
    cuisine: "Indian • Mughlai • Royal Bowls",
    rating: 4.7,
    deliveryTime: "30-35 min",
    discount: "15% OFF",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
    badge: "Crowd Favorite"
  },
  {
    id: "r4",
    name: "Sakura Ramen & Wok Bar",
    cuisine: "Japanese • Asian Noodle Bowls",
    rating: 4.9,
    deliveryTime: "20-30 min",
    discount: "Free Dim Sums on ₹499+",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    badge: "Chef's Choice"
  }
];

export const specialOffers = [
  {
    id: "off1",
    title: "Flat 30% OFF Your First Feast",
    subtitle: "Use promo code CRAVE30 on all gourmet selections",
    code: "CRAVE30",
    tag: "Welcome Deal",
    bgGradient: "from-orange-500 to-amber-500",
    icon: "Utensils"
  },
  {
    id: "off2",
    title: "Free Delivery on Orders Over ₹499",
    subtitle: "Automatic perk unlocked at checkout on all restaurants",
    code: "FREESHIP",
    tag: "No Min Fees",
    bgGradient: "from-rose-500 to-orange-400",
    icon: "Truck"
  },
  {
    id: "off3",
    title: "Weekend Pizza Party Combo",
    subtitle: "Buy any 2 Large Gourmet Pizzas & get free Lava Cake",
    code: "PIZZALOVE",
    tag: "Weekend Special",
    bgGradient: "from-amber-600 to-yellow-500",
    icon: "Flame"
  }
];

export const customerReviews = [
  {
    id: "rev1",
    name: "Sophia Martinez",
    role: "Food Blogger & Architect",
    rating: 5,
    comment: "The Truffle Mushroom burger arrived piping hot and packed like fine dining. The user interface is so snappy and clean, best ordering experience by far!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "rev2",
    name: "Marcus Chen",
    role: "Software Engineer",
    rating: 5,
    comment: "Ordered the Dum Chicken Biryani for dinner. Outstanding authentic flavors, live status tracking worked flawlessly, and the driver was prompt.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "rev3",
    name: "Elena Rostova",
    role: "Fitness Coach",
    rating: 5,
    comment: "Love the clear veg indicators and healthy bowl options! The Avocado Tofu Poke is super fresh every single time. 10/10 recommendation.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  }
];
