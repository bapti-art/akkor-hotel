export interface User {
  id: string;
  email: string;
  pseudo: string;
  role: 'user' | 'employee' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  picture_list: string[];
  createdAt: string;
  updatedAt: string; 
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  hotel?: Hotel;
  user?: User;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'confirmed' | 'cancelled' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
