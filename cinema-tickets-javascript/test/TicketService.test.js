import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
describe("TicketService", () => {
    let ticketService;
    let paymentMock;
    let reservationMock;

    beforeEach(() => {
        paymentMock = { makePayment: jest.fn() };
        reservationMock = { reserveSeat: jest.fn() };

        ticketService = new TicketService(paymentMock, reservationMock);
    });
    });
