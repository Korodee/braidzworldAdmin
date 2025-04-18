import { ErrorResponse } from "./authService";

// Mock data for gallery with correct image paths
const mockGallery = [
  {
    url: "/img/gal1.jpg",
    caption: "Elegant Updo"
  },
  {
    url: "/img/gal2.jpg",
    caption: "Natural Hair Styling"
  },
  {
    url: "/img/gal3.jpg",
    caption: "Color Transformation"
  },
  {
    url: "/img/gal4.jpg",
    caption: "Bridal Hairstyle"
  },
  {
    url: "/img/gal5.jpg",
    caption: "Curly Hair Treatment"
  },
  {
    url: "/img/gal6.jpg",
    caption: "Haircut and Styling"
  },
  {
    url: "/img/gal7.jpg",
    caption: "Hair Coloring"
  },
  {
    url: "/img/twists.png",
    caption: "Twists Hairstyle"
  },
  {
    url: "/img/short-knotless-braids.png",
    caption: "Short Knotless Braids"
  },
  {
    url: "/img/sen-twists.png",
    caption: "Senegalese Twists"
  },
  {
    url: "/img/knotless-braids.png",
    caption: "Knotless Braids"
  },
  {
    url: "/img/invicible-locs.png",
    caption: "Invisible Locs"
  },
  {
    url: "/img/fulani-braids.png",
    caption: "Fulani Braids"
  },
  {
    url: "/img/fake-locs.png",
    caption: "Fake Locs"
  },
  {
    url: "/img/cornrows.png",
    caption: "Cornrows"
  }
];

export const fetchGallery = async () => {
    try {
        // Return mock data instead of making API call
        return mockGallery;
        
        // Commented out actual API call for now
        // const response = await api.get("/gallery");
        // return response.data
    } catch (error) {
        throw error as ErrorResponse;
    }
}