const TicketType = Object.freeze({
  ADULT: {
    type: 'ADULT',
    price: 25,
    requiresSeat: true
  },
  CHILD: {
    type: 'CHILD',
    price: 15,
    requiresSeat: true
  },
  INFANT: {
    type: 'INFANT',
    price: 0,
    requiresSeat: false
  }
});

export default TicketType;