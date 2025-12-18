// District and Upazila data
// This data should be fetched from: https://github.com/nuhil/bangladesh-geocode
// For now, including a sample structure. Replace with actual data from the repository.

export const districts = [
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh',
  'Comilla', 'Gazipur', 'Narayanganj', 'Tangail', 'Jessore', 'Bogra', 'Dinajpur', 'Faridpur',
  'Pabna', 'Kushtia', 'Noakhali', 'Feni', 'Cox\'s Bazar', 'Brahmanbaria', 'Chandpur', 'Lakshmipur',
  'Sirajganj', 'Jamalpur', 'Sherpur', 'Netrokona', 'Kishoreganj', 'Manikganj', 'Munshiganj', 'Narsingdi'
];

// Sample upazilas - In production, this should be a nested object with districts as keys
export const upazilasByDistrict = {
  'Dhaka': ['Dhanmondi', 'Gulshan', 'Uttara', 'Motijheel', 'Ramna', 'Tejgaon', 'Wari', 'Lalbagh'],
  'Chittagong': ['Chandgaon', 'Hathazari', 'Raujan', 'Fatikchhari', 'Sandwip', 'Sitakunda', 'Mirsharai', 'Patiya'],
  'Sylhet': ['Sylhet Sadar', 'Beanibazar', 'Balaganj', 'Bishwanath', 'Balaganj', 'Fenchuganj', 'Golapganj', 'Gowainghat'],
  'Rajshahi': ['Rajshahi Sadar', 'Bagha', 'Bagmara', 'Charghat', 'Durgapur', 'Godagari', 'Mohanpur', 'Paba'],
  'Khulna': ['Khulna Sadar', 'Batiaghata', 'Dacope', 'Dumuria', 'Dighalia', 'Koyra', 'Paikgachha', 'Phultala'],
  'Barisal': ['Barisal Sadar', 'Agailjhara', 'Babuganj', 'Bakerganj', 'Banaripara', 'Gaurnadi', 'Hizla', 'Mehendiganj'],
  'Rangpur': ['Rangpur Sadar', 'Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgacha', 'Pirganj', 'Taraganj'],
  'Mymensingh': ['Mymensingh Sadar', 'Bhaluka', 'Dhobaura', 'Fulbaria', 'Gaffargaon', 'Gauripur', 'Haluaghat', 'Ishwarganj']
};

// Get upazilas for a specific district
export const getUpazilasByDistrict = (district) => {
  return upazilasByDistrict[district] || [];
};

// Note: Replace this data with actual data from the bangladesh-geocode repository
// The repository contains comprehensive district and upazila data in JSON format

