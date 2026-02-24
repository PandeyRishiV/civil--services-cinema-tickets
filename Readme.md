# Cinema Tickets Service (Javascript)

### Overview

This solution implements the TicketService responsible for validating ticket purchases, calculating payment amounts, and reserving seats according to the defined business rules.
The implementation focuses on clean domain modelling, separation of concerns, and testability.

### Design Approach

Ticket types are modelled as structured objects containing:

##### type

##### price

##### requiresSeat

This removes hardcoded conditionals and makes calculations data driven.
All pricing and seat allocation rules derive from the ticket model rather than explicit branching logic.

### Validation Strategy

Validation is performed in clear stages:

- Account validation
- Request presence validation
- Aggregation of ticket counts
- Business rule validation

External services are only invoked after all validations pass.

### Business Rules Enforced

- Maximum 25 tickets per purchase

- Child and Infant tickets require at least one Adult

- Number of Infants cannot exceed number of Adults

- Infants do not require seats

- Payment calculated from ticket pricing model

### Dependency Injection

TicketService accepts external services via constructor injection.

This enables:

- Loose coupling

- Easy mocking in tests

- Clear separation between orchestration and infrastructure

If no dependencies are provided, default implementations are used.

### Testing

Jest is used for unit testing.

Tests cover:

- Successful purchase flow

- All invalid purchase scenarios

- Verification that external services are not called when validation fails

To run tests:

1. npm install
2. npm test

### Assumptions

- All account IDs greater than zero are valid and sufficiently funded

- Third party services behave correctly once invoked

- TicketTypeRequest is immutable as provided
