import {
  FiEye,
  FiDroplet,
  FiWifi,
  FiHome,
  FiCoffee,
  FiWind,
  FiGrid,
  FiMonitor,
} from "react-icons/fi";

export const ROOMS = [
  {
    id: 1,
    baseName: "Classic Sunroom",
    slug: "classic-sunroom",
    name: [
      "Limited Period - Classic Sunroom - CP",
      "Classic Sunroom - CP"
    ],
    description:
      "Bathed in soft daylight and surrounded by the whisper of trees, the Classic Sunroom is where nature and quiet refinement meet. Large glass walls frame the forest like a living painting, flooding the space with golden morning light. Handcrafted wooden furniture, warm earthy tones, and southern yellow pine flooring create an atmosphere that feels timeless — serene yet full of quiet vitality",
    stayIncludes: [
      "Daily Breakfast",
      "In-room refreshments",
      "A Forest Trail activity",
    ],
    amenities: [
      { label: "Forest View", icon: FiEye },
      { label: "Mini Bar", icon: FiDroplet },
      { label: "Wi-fi", icon: FiWifi },
      { label: "Room with Sofa", icon: FiHome },
      { label: "In room tea and coffee", icon: FiCoffee },
   
    ],
    features: [
      {
        title: "Garden Views",
        image: "/Classic_Sunroom_1.jpg",
      },
      {
        title: "Space For Two",
        image: "/Classic_Sunroom_2.jpg",
      },
      {
        title: "Original Features",
        image: "/Classic_Sunroom_3.jpg",
      },
      {
        title: "Large Bathroom",
        image: "/Classic_Sunroom_4.jpg",
      },
    ],
  },
  {
    id: 2,
    baseName: "Forest Bathtub Room",
    slug: "forest-bathtub-room",
    name: [
      "Limited Period - Forest Bathtub - CP",
      "Forest Bathtub - CP"
    ],
    description:
      "Hidden deep within the green expanse of The Arboreal Resort, the Forest Bathtub Room invites you to experience pure immersion in nature. Crafted entirely in warm pinewood and framed by sweeping glass windows, the room opens into dense foliage, blending the calm of natural light with the elegance of handcrafted interiors.",
    stayIncludes: [
      "Daily Breakfast",
      "In-room refreshments",
      "Round-trip transfer from Lonavala station (3 nights+)",
      "Forest Trail activity",
    ],
    amenities: [
      { label: "Forest View", icon: FiEye },
      { label: "Mini Bar", icon: FiDroplet },
      { label: "Wi-fi", icon: FiWifi },
      { label: "Room with Sofa & Work Table", icon: FiHome },
      { label: "In room tea and coffee", icon: FiCoffee },
      { label: "Private balcony with Bathtub", icon: FiGrid },
      { label: "Four-Poster Bed", icon: FiHome },
      { label: "Ensuite bathroom with toiletries", icon: FiMonitor },
    ],
    features: [
      {
        title: "Garden Views",
        image: "/Forest_Bathtub_01.jpg",
      },
      {
        title: "Space For Two",
        image: "/Forest_Bathtub_02.jpg",
      },
      {
        title: "Original Features",
        image: "/Forest_Bathtub_03.jpg",
      },
      {
        title: "Large Bathroom",
        image: "/Forest_Bathtub_04.jpg",
      },
    ],
  },
  {
    id: 3,
    baseName: "Luxury Sunroom",
    slug: "luxury-sunroom",
    name: [
      "Limited Period - Luxury Sunroom - CP",
      "Luxury Sunroom - CP"
    ],
    description:
      "Perched among whispering trees and lush slopes, the Luxury Sunroom blends sweeping natural beauty with refined comfort. This elegant retreat features a plush king-size bed, soft ambient lighting, and floor-to-ceiling windows that frame panoramic mountain and forest views.",
    stayIncludes: [
      "Daily Breakfast",
      "In-room refreshments",
      "Round-trip transfer from Lonavala station (3 nights+)",
      "Forest Trail activity",
    ],
    amenities: [
      { label: "Mountain with Forest View", icon: FiEye },
      { label: "Mini Bar", icon: FiDroplet },
      { label: "Wi-fi", icon: FiWifi },
      { label: "Room with Sofa & Work Table", icon: FiHome },
      { label: "In room tea and coffee", icon: FiCoffee },
      { label: "Private balcony", icon: FiGrid },
      { label: "Four-Poster Bed", icon: FiHome },
      { label: "Ensuite bathroom with toiletries", icon: FiMonitor },
      { label: "Double Sized Bathtub (2 ppl)", icon: FiWind },
    ],
    features: [
      {
        title: "Garden Views",
        image: "/Luxury_Sunroom_Arboreal_01.jpg",
      },
      {
        title: "Space For Two",
        image: "/Luxury_Sunroom_Arboreal_02.jpg",
      },
      {
        title: "Original Features",
        image: "/Luxury_Sunroom_Arboreal_03.jpg",
      },
      {
        title: "Large Bathroom",
        image: "/Luxury_Sunroom_Arboreal_04.jpg",
      },
    ],
  },
  {
    id: 4,
    baseName: "Forest Private Pool Room",
    slug: "forest-private-pool-room",
    name: [
      "Limited Period - Forest Private Pool - CP",
      "Forest Private Pool - CP"
    ],
    description:
      "The Forest Room – Private Pool offers a sublime blend of privacy, nature, and luxury. Featuring a king-size bed, modern comforts, and a private pool on the balcony — perfect for two adults (plus one child).",
    stayIncludes: [
      "Daily Breakfast",
      "In-room refreshments",
      "Round-trip transfer from Lonavala station (3 nights+)",
      "Forest Trail activity",
    ],
    amenities: [
      { label: "Mountain with Forest View", icon: FiEye },
      { label: "Mini Bar", icon: FiDroplet },
      { label: "Wi-fi", icon: FiWifi },
      { label: "Room with Sofa", icon: FiHome },
      { label: "In room tea and coffee", icon: FiCoffee },
      { label: "Private balcony with Pool", icon: FiGrid },
      { label: "Four-Poster Bed", icon: FiHome },
      { label: "Ensuite bathroom with toiletries", icon: FiMonitor },
    ],
    features: [
      {
        title: "Garden Views",
        image: "/Forest_Private_Pool_1.jpg",
      },
      {
        title: "Space For Two",
        image: "/Forest_Private_Pool_2.jpg",
      },
      {
        title: "Original Features",
        image: "/Forest_Private_Pool_3.jpg",
      },
      {
        title: "Large Bathroom",
        image: "/Forest_Private_Pool_4.jpg",
      },
    ],
  },
];

// Helper function to find room data by name
export const findRoomByName = (roomName) => {
  if (!roomName) return null;

  const query = roomName.toLowerCase();

  return ROOMS.find((room) => {
    const candidates = [
      ...(room.name || []),
      room.baseName,
      room.slug,
    ].filter(Boolean);

    return candidates.some((candidate) => {
      const value = candidate.toLowerCase();
      return query.includes(value) || value.includes(query);
    });
  });
};




