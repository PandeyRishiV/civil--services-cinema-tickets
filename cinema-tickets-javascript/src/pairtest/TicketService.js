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

    #validateAccount(accountId) {
        if (!Number.isInteger(accountId) || accountId <= 0) {
            throw new InvalidPurchaseException("Invalid accountId");
        }
    }

    #validateRequests(ticketTypeRequests) {
        if (!ticketTypeRequests || ticketTypeRequests.length === 0) {
            throw new InvalidPurchaseException("No tickets requested");
        }
    }

  }
}
