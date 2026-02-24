import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js'
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js'
import InvalidPurchaseException from './lib/InvalidPurchaseException.js'
import TicketType from './lib/TicketType.js'

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
        const ticketCounts = this.#aggregateTickets(ticketTypeRequests)

        // Check for further invalid cases
        this.#validateBusinessRules(ticketCounts)

        // Calculate total amount and seats (infant excluded)
        const totalAmount = this.#calculateAmount(ticketCounts)
        const totalSeats = this.#calculateSeats(ticketCounts)

        this.#paymentService.makePayment(accountId, totalAmount)
        this.#seatReservationService.reserveSeat(accountId, totalSeats)
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

    #validateBusinessRules(ticketCounts) {
        const adultCount = ticketCounts[TicketType.ADULT.type]
        const childCount = ticketCounts[TicketType.CHILD.type]
        const infantCount = ticketCounts[TicketType.INFANT.type]

        const totalTickets = Object.values(ticketCounts).reduce(
            (sum, count) => sum + count,
            0,
        )

        if (totalTickets > MAX_TICKET_COUNT) {
            throw new InvalidPurchaseException(
                'Cannot purchase more than 25 tickets',
            )
        }

        if ((childCount > 0 || infantCount > 0) && adultCount === 0) {
            throw new InvalidPurchaseException(
                `Cannot purchase more than ${MAX_TICKET_COUNT} tickets`,
            )
        }

        if (infantCount > adultCount) {
            throw new InvalidPurchaseException(
                'Each Infant must be accompanied by one Adult',
            )
        }
    }

    #calculateAmount(ticketCounts) {
        return Object.values(TicketType).reduce((total, ticket) => {
            const count = ticketCounts[ticket.type] ?? 0
            return total + count * ticket.price
        }, 0)
    }

    #calculateSeats(ticketCounts) {
        return Object.values(TicketType).reduce((total, ticketDef) => {
            const count = ticketCounts[ticketDef.type] ?? 0
            return ticketDef.requiresSeat ? total + count : total
        }, 0)
    }
}
