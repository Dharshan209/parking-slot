# Parking Lot Management System

A robust NestJS application that simulates a parking lot management system, allowing for car parking, slot allocation, and various queries.

## Overview

This system provides a RESTful API to manage a parking lot with features such as:
- Creating and expanding a parking lot
- Parking cars with registration numbers and colors
- Clearing parking slots
- Querying parking status
- Finding cars by registration number or color

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Validation**: class-validator

## Project Structure

```
src/
├── app.module.ts              # Root application module
├── main.ts                    # Application entry point
└── parking/                   # Parking module folder
    ├── parking.module.ts      # Parking module definition
    ├── parking.controller.ts  # API endpoints
    ├── parking.service.ts     # Business logic
    ├── dto/                   # Data Transfer Objects
    │   ├── create-parking.dto.ts
    │   ├── park-car.dto.ts
    │   └── clear-slot.dto.ts
    └── interface/
        └── car.interface.ts   # Car interface definition
```

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd parking-lot-management

# Install dependencies
npm install
```

## Running the Application

```bash
# Development mode
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod
```

Server runs on http://localhost:3000 by default.

## API Endpoints

### Parking Lot Management

#### Create a Parking Lot
- **Endpoint**: POST `/parking_lot`
- **Request Body**:
  ```json
  {
    "no_of_slot": 5
  }
  ```
- **Response**:
  ```json
  {
    "total_slot": 5
  }
  ```

#### Expand Parking Lot
- **Endpoint**: PATCH `/parking_lot`
- **Request Body**:
  ```json
  {
    "increment_slot": 3
  }
  ```
- **Response**:
  ```json
  {
    "total_slots": 8
  }
  ```

### Car Operations

#### Park a Car
- **Endpoint**: POST `/park`
- **Request Body**:
  ```json
  {
    "reg_no": "ABC123",
    "color": "Red"
  }
  ```
- **Response**:
  ```json
  {
    "allocated_slot": 1
  }
  ```

#### Clear a Parking Slot
- **Endpoint**: POST `/clear`
- **Request Body** (by slot number):
  ```json
  {
    "slot_number": 1
  }
  ```
- **Request Body** (by registration number):
  ```json
  {
    "car_registration_no": "ABC123"
  }
  ```
- **Response**:
  ```json
  {
    "cleared_slot": 1
  }
  ```

### Queries

#### Get Parking Status
- **Endpoint**: GET `/status`
- **Response**:
  ```json
  [
    {
      "slot_no": 1,
      "car_registration": "ABC123",
      "car_color": "Red"
    },
    {
      "slot_no": 2,
      "car_registration": "XYZ789",
      "car_color": "Blue"
    }
  ]
  ```

#### Get Registration Numbers by Color
- **Endpoint**: GET `/registration_numbers/color/:color`
- **Example**: `/registration_numbers/color/red`
- **Response**:
  ```json
  {
    "color": "red",
    "registration_numbers": ["ABC123", "DEF456"]
  }
  ```

#### Get Slot Number by Registration Number
- **Endpoint**: GET `/slot?registration_number=ABC123`
- **Response**:
  ```json
  {
    "registration_number": "ABC123",
    "slot_number": 1
  }
  ```

#### Get Slot Numbers by Color
- **Endpoint**: GET `/slots/color/:color`
- **Example**: `/slots/color/blue`
- **Response**:
  ```json
  {
    "color": "blue",
    "slot_numbers": [2, 4, 6]
  }
  ```

## Core Features

1. **Nearest Available Slot Allocation**: The system allocates the nearest available slot to incoming cars.

2. **Validation**: Input validation using class-validator ensures data integrity.

3. **Error Handling**: Comprehensive error handling for scenarios like:
   - Parking lot not initialized
   - Parking lot full
   - Car not found
   - Slot already free

## Data Structures

The service uses several data structures to maintain the parking lot state:

- `totalslots`: Number of total slots in the parking lot
- `availableSlots`: Array of available slot numbers
- `allocation`: Map of slot numbers to car objects
- `slottoreg`: Map of car registration numbers to slot numbers

## Business Logic

### Parking Allocation Strategy

The system follows a "nearest slot first" strategy, always assigning the lowest available slot number to a new car.

### Slot Clearing

When a car leaves, its slot becomes available again and is added back to the available slots pool.

## Error Handling

The application handles various error scenarios:

- `BadRequestException`: For invalid inputs or operations
- `NotFoundException`: When requested resources aren't found

## Development

### Adding New Features

1. Define DTOs in the `dto` folder
2. Add new methods to `parking.service.ts`
3. Create endpoints in `parking.controller.ts`

### Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## License

[MIT License](LICENSE)