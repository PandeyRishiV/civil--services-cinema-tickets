import TicketPaymentService from "../thirdparty/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/SeatReservationService.js";

export default class TicketService {
    #paymentService;
    #seatReservationService;

    constructor() {
        this.#paymentService = new TicketPaymentService();
        this.#seatReservationService = new SeatReservationService();
    }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    }
  }
}
