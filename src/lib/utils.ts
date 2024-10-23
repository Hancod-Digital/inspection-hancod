import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const majorCategoryDataRange = [{from:'equipment_type',to:'equipment_type'}]
export const siteDataRange = [{from:'area',to:'area'}]
export const equipmentDataRange = [{from:'equipment_type',to:'equipment_type'}]

export const locationDataRange = [{from:'site',to:'site'}]
export const minorCategoryDataRange = [{from:'major_category',to:'major_category'},{from:'standard',to:'standard'}]



export function replaceHyphen(str: string) {
  if (str.includes('-')) {
      return str.replace(/-/g, '_');  // Replace all hyphens with underscores
  } else {
      return str;  // Return string as is if no hyphens are present
  }
}

export function getSubTopicOne(str: string) {
  // Split the string by "/"
  console.log(str);
  
  const parts = str.split('/');
  
  // Check if there are at least 3 parts to ensure the second slash exists and has a word after it
  if (parts.length > 1) {
    
      return replaceHyphen(parts[1]); // The word after the second slash
  } else {
      return null; // Return null if the word after the second slash doesn't exist
  }
}
export function getLastTwoDigitsOfCurrentYear(): string {
  const year = new Date().getFullYear();
  const lastTwoDigits = (year % 100).toString(); // Convert to string
  const paddedYear = lastTwoDigits.padStart(4, '0'); // Pad to 4 digits
  return paddedYear;
}

export function getSubTopic(str: string) {
  // Split the string by "/"
  console.log(str);
  
  const parts = str.split('/');
  
  // Check if there are at least 3 parts to ensure the second slash exists and has a word after it
  if (parts.length > 2) {
    
      return replaceHyphen(parts[2]); // The word after the second slash
  } else {
      return null; // Return null if the word after the second slash doesn't exist
  }
}

export function joinFunctions(locations: any[], sites: any[]) {
  return locations?.map(location => {
      // Find the site record that matches the location's site ID
      const matchedSite = sites.find(site => site.id === location.site);
      
      // Return a new object that includes the location data and the site name
      return {
          ...location,
          join: matchedSite ? matchedSite.name : 'Unknown Site' // Add site name or fallback to 'Unknown Site'
      };
  });
}
