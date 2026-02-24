import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js'
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js'
import InvalidPurchaseException from './lib/InvalidPurchaseException.js'

const MAX_TICKET_COUNT = 25

export default class TicketService {
    #paymentService
    #seatReservationService

    constructor(paymentService, seatReservationService) {
        this.#paymentService = paymentService ?? new TicketPaymentService()
        this.#seatReservationService =
            seatReservationService ?? new SeatReservationService()
    }

    purchaseTickets(accountId, ...ticketTypeRequests) {
        // Check if account id > 0
        this.#validateAccount(accountId)

        // Check if ticket types and length are valid
        this.#validateRequests(ticketTypeRequests)

        // Get count for each type of ticket
        const { adultCount, childCount, infantCount } =
            this.#aggregateTickets(ticketTypeRequests);

        // Check for further invalid cases
        this.#validateBusinessRules(adultCount, childCount, infantCount);

        // Calculate total amount and seats (infant excluded)
        const totalAmount = this.#calculateAmount(adultCount, childCount);
        const totalSeats = this.#calculateSeats(adultCount, childCount);

        this.#paymentService.makePayment(accountId, totalAmount);
        this.#seatReservationService.reserveSeat(accountId, totalSeats);
    }

    #validateAccount(accountId) {
        if (!Number.isInteger(accountId) || accountId <= 0) {
            throw new InvalidPurchaseException('Invalid accountId')
        }
    }

    #validateRequests(ticketTypeRequests) {
        if (!ticketTypeRequests || ticketTypeRequests.length === 0) {
            throw new InvalidPurchaseException('No tickets requested')
        }
    }

    #aggregateTickets(ticketTypeRequests) {
        const ticketCounts = {}

        for (const ticket of Object.values(TicketType)) {
            ticketCounts[ticket.type] = 0
        }

        for (const request of ticketTypeRequests) {
            const type = request.getTicketType()
            const count = request.getNoOfTickets()

                if (count <= 0) {
                    throw new InvalidPurchaseException(
                    'Ticket count must be greater than zero',
                )
                }

            if (!(type in ticketCounts)) {
                throw new InvalidPurchaseException('Unknown ticket type')
            }

            ticketCounts[type] += count
        }

        return ticketCounts
    }

    #validateBusinessRules(adultCount, childCount, infantCount) {
        const totalTickets = adultCount + childCount + infantCount;

        if (totalTickets > MAX_TICKET_COUNT) {
            throw new InvalidPurchaseException(
                "Cannot purchase more than 25 tickets",
            );
        }

        if ((childCount > 0 || infantCount > 0) && adultCount === 0) {
            throw new InvalidPurchaseException(
                "Child and Infant tickets require at least one Adult ticket",
            );
        }

        if (infantCount > adultCount) {
            throw new InvalidPurchaseException(
                "Each Infant must be accompanied by one Adult",
            );
        }
    }

    #calculateAmount(adultCount, childCount) {
        return (
            adultCount * ADULT_TICKET_PRICE + childCount * CHILD_TICKET_PRICE
        );
    }

    #calculateSeats(adultCount, childCount) {
        return adultCount + childCount;
    }
}
