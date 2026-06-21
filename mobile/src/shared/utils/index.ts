import { Config } from "../../config";
import { IP } from "../../config/ip";

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString("vi-VN") + "đ";
};

export const resolveImageUrl = (imageInput: any): string => {
  if (!imageInput) return "https://via.placeholder.com/400";
  
  let img = "";
  if (Array.isArray(imageInput)) {
    img = imageInput[0];
  } else if (typeof imageInput === 'string') {
    try {
      const parsed = JSON.parse(imageInput);
      img = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      img = imageInput;
    }
  } else {
    img = String(imageInput);
  }
  
  if (typeof img !== 'string') return "https://via.placeholder.com/400";
  img = img.trim();
  
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:image")) {
    return img.replace("localhost", IP);
  }
  
  // Protocol-relative URL (e.g., //example.com/image.png)
  if (img.startsWith("//")) {
    return `https:${img}`;
  }
  
  // Remote URL missing http/https prefix (e.g., res.cloudinary.com/...)
  const isRemoteUrl = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\//.test(img);
  if (isRemoteUrl) {
    return `https://${img}`;
  }
  
  // Base64 encoded string (support standard and base64url)
  const cleaned = img.replace(/\s+/g, '');
  if (cleaned.length > 100 && /^[A-Za-z0-9+/=\-_]+$/.test(cleaned)) {
    let mime = 'jpeg';
    if (cleaned.startsWith('iVBOR')) mime = 'png';
    else if (cleaned.startsWith('UklGR')) mime = 'webp';
    else if (cleaned.startsWith('R0lGOD')) mime = 'gif';
    
    return `data:image/${mime};base64,${cleaned}`;
  }
  
  // Fallback to local backend path
  return `${Config.API_URL}${img.startsWith('/') ? '' : '/'}${img}`;
};

