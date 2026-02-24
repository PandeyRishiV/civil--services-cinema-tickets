import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import { jest, describe, test, expect, beforeEach } from "@jest/globals";

describe("TicketService", () => {
    let ticketService;
    let paymentMock;
    let reservationMock;

    beforeEach(() => {
        paymentMock = { makePayment: jest.fn() };
        reservationMock = { reserveSeat: jest.fn() };

        ticketService = new TicketService(paymentMock, reservationMock);
    });

    test("successfully purchases tickets", () => {
        ticketService.purchaseTickets(
            1,
            new TicketTypeRequest("ADULT", 2),
            new TicketTypeRequest("CHILD", 1),
            new TicketTypeRequest("INFANT", 1),
        );

        expect(paymentMock.makePayment).toHaveBeenCalledWith(1, 65);
        expect(reservationMock.reserveSeat).toHaveBeenCalledWith(1, 3);
    });

    test("rejects invalid account id", () => {
        expect(() =>
            ticketService.purchaseTickets(0, new TicketTypeRequest("ADULT", 1)),
        ).toThrow(InvalidPurchaseException);

        expect(paymentMock.makePayment).not.toHaveBeenCalled();
    });

    test("rejects purchase without adult when child present", () => {
        expect(() =>
            ticketService.purchaseTickets(1, new TicketTypeRequest("CHILD", 1)),
        ).toThrow(InvalidPurchaseException);
    });

    test("rejects purchase without adult when infant present", () => {
        expect(() =>
            ticketService.purchaseTickets(
                1,
                new TicketTypeRequest("INFANT", 1),
            ),
        ).toThrow(InvalidPurchaseException);
    });

    test("rejects more than 25 tickets", () => {
        expect(() =>
            ticketService.purchaseTickets(
                1,
                new TicketTypeRequest("ADULT", 26),
            ),
        ).toThrow(InvalidPurchaseException);
    });

    test("rejects more infants than adults", () => {
        expect(() =>
            ticketService.purchaseTickets(
                1,
                new TicketTypeRequest("ADULT", 1),
                new TicketTypeRequest("INFANT", 2),
            ),
        ).toThrow(InvalidPurchaseException);
    });

    test("rejects empty request", () => {
        expect(() => ticketService.purchaseTickets(1)).toThrow(
            InvalidPurchaseException,
        );
    });
});
