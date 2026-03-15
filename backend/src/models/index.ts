import { User, IUser, initUserModel } from './User';
import { Hotel, IHotel, initHotelModel } from './Hotel';
import { Booking, IBooking, initBookingModel, setupAssociations } from './Booking';

export { User, IUser, initUserModel };
export { Hotel, IHotel, initHotelModel };
export { Booking, IBooking, initBookingModel, setupAssociations };

export function initModels(): void {
  initUserModel();
  initHotelModel();
  initBookingModel();
  setupAssociations();
}
