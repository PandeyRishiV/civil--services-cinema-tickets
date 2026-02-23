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

    #aggregateTickets(ticketTypeRequests) {
        let adultCount = 0;
        let childCount = 0;
        let infantCount = 0;

        return ticketTypeRequests.reduce(
            (acc, request) => {
                const type = request.getTicketType();
                const count = request.getNoOfTickets();

                if (count <= 0) {
                    throw new InvalidPurchaseException(
                        "Ticket count must be greater than zero",
                    );
                }

                switch (type) {
                    case "ADULT":
                        acc.adultCount += count;
                        break;
                    case "CHILD":
                        acc.childCount += count;
                        break;
                    case "INFANT":
                        acc.infantCount += count;
                        break;
                    default:
                        throw new InvalidPurchaseException(
                            "Unknown ticket type",
                        );
                }

                return acc;
            },
            { adultCount: 0, childCount: 0, infantCount: 0 },
        );
    }
  }
}
