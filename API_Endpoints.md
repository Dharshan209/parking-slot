# Parking Lot Management System - API Documentation

## Base URL

All endpoints are relative to `http://localhost:3000` by default.
And also use this `https://parking-slot-six.vercel.app/` endpoint

## Authentication

Currently, the API does not implement authentication mechanisms.

## API Endpoints

### 1. Parking Lot Management

#### 1.1 Create a Parking Lot

Creates a new parking lot with the specified number of slots.

- **Endpoint**: `POST /parking_lot`
- **Content-Type**: `application/json`
- **Request Body**:

  | Field | Type | Required | Description |
  |-------|------|----------|-------------|
  | `no_of_slot` | integer | Yes | Number of parking slots to create (minimum: 1) |

- **Success Response**:
  - **Code**: 201 Created
  - **Content Example**:
    ```json
    {
      "total_slot": 5
    }
    ```

- **Error Responses**:
  - **Code**: 400 Bad Request
    - If `no_of_slot` is missing or not a positive integer
    ```json
    {
      "statusCode": 400,
      "message": ["no_of_slot must be a positive integer"],
      "error": "Bad Request"
    }
    ```

- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/parking_lot \
    -H "Content-Type: application/json" \
    -d '{"no_of_slot": 5}'
  ```

#### 1.2 Expand Parking Lot

Increases the size of an existing parking lot by adding more slots.

- **Endpoint**: `PATCH /parking_lot`
- **Content-Type**: `application/json`
- **Request Body**:

  | Field | Type | Required | Description |
  |-------|------|----------|-------------|
  | `increment_slot` | integer | Yes | Number of additional slots to add |

- **Success Response**:
  - **Code**: 200 OK
  - **Content Example**:
    ```json
    {
      "total_slots": 8
    }
    ```

- **Error Responses**:
  - **Code**: 400 Bad Request
    - If `increment_slot` is missing or not a positive number

- **cURL Example**:
  ```bash
  curl -X PATCH http://localhost:3000/parking_lot \
    -H "Content-Type: application/json" \
    -d '{"increment_slot": 3}'
  ```

### 2. Car Parking Operations

#### 2.1 Park a Car

Parks a car in the nearest available slot.

- **Endpoint**: `POST /park`
- **Content-Type**: `application/json`
- **Request Body**:

  | Field | Type | Required | Description |
  |-------|------|----------|-------------|
  | `reg_no` | string | Yes | Car registration number |
  | `color` | string | Yes | Car color |

- **Success Response**:
  - **Code**: 201 Created
  - **Content Example**:
    ```json
    {
      "allocated_slot": 1
    }
    ```

- **Error Responses**:
  - **Code**: 400 Bad Request
    - If parking lot is not initialized
    ```json
    {
      "statusCode": 400,
      "message": "Parking lot not initialized. Please create parking lot first.",
      "error": "Bad Request"
    }
    ```
    - If parking lot is full
    ```json
    {
      "statusCode": 400,
      "message": "Parking is full. No slots available.",
      "error": "Bad Request"
    }
    ```
    - If required fields are missing
    ```json
    {
      "statusCode": 400,
      "message": ["reg_no must be a string", "color must be a string"],
      "error": "Bad Request"
    }
    ```

- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/park \
    -H "Content-Type: application/json" \
    -d '{"reg_no": "ABC123", "color": "Red"}'
  ```

#### 2.2 Clear a Parking Slot

Removes a car from a parking slot, making it available again. Can be cleared by either slot number or registration number.

- **Endpoint**: `POST /clear`
- **Content-Type**: `application/json`
- **Request Body**:

  | Field | Type | Required | Description |
  |-------|------|----------|-------------|
  | `slot_number` | integer | No* | Slot number to clear |
  | `car_registration_no` | string | No* | Registration number of car to remove |

  *At least one of these fields must be provided

- **Success Response**:
  - **Code**: 200 OK
  - **Content Example**:
    ```json
    {
      "cleared_slot": 1
    }
    ```

- **Error Responses**:
  - **Code**: 400 Bad Request
    - If neither field is provided
    ```json
    {
      "statusCode": 400,
      "message": "Please provide either slot_number or car_registration_no",
      "error": "Bad Request"
    }
    ```
  - **Code**: 404 Not Found
    - If slot is already free
    ```json
    {
      "statusCode": 404,
      "message": "Slot already free.",
      "error": "Not Found"
    }
    ```
    - If car with given registration is not found
    ```json
    {
      "statusCode": 404,
      "message": "Car with this registration number not found.",
      "error": "Not Found"
    }
    ```

- **cURL Examples**:
  ```bash
  # Clear by slot number
  curl -X POST http://localhost:3000/clear \
    -H "Content-Type: application/json" \
    -d '{"slot_number": 1}'
  
  # Clear by car registration
  curl -X POST http://localhost:3000/clear \
    -H "Content-Type: application/json" \
    -d '{"car_registration_no": "ABC123"}'
  ```

### 3. Parking Queries

#### 3.1 Get Parking Status

Retrieves the current status of all occupied parking slots.

- **Endpoint**: `GET /status`
- **Success Response**:
  - **Code**: 200 OK
  - **Content Example**:
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

- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/status
  ```

#### 3.2 Get Registration Numbers by Color

Retrieves all car registration numbers for cars of a specific color.

- **Endpoint**: `GET /registration_numbers/color/:color`
- **URL Parameters**:

  | Parameter | Type | Required | Description |
  |-----------|------|----------|-------------|
  | `color` | string | Yes | Color of cars to search for |

- **Success Response**:
  - **Code**: 200 OK
  - **Content Example**:
    ```json
    {
      "color": "red",
      "registration_numbers": ["ABC123", "DEF456"]
    }
    ```

- **Error Responses**:
  - **Code**: 404 Not Found
    - If no cars of the specified color are found
    ```json
    {
      "statusCode": 404,
      "message": "No cars found with color: red",
      "error": "Not Found"
    }
    ```

- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/registration_numbers/color/red
  ```

#### 3.3 Get Slot Number by Registration Number

Finds the slot number where a car with a specific registration number is parked.

- **Endpoint**: `GET /slot`
- **Query Parameters**:

  | Parameter | Type | Required | Description |
  |-----------|------|----------|-------------|
  | `registration_number` | string | Yes | Car registration number to search for |

- **Success Response**:
  - **Code**: 200 OK
  - **Content Example**:
    ```json
    {
      "registration_number": "ABC123",
      "slot_number": 1
    }
    ```

- **Error Responses**:
  - **Code**: 400 Bad Request
    - If registration number is not provided
    ```json
    {
      "statusCode": 400,
      "message": "Registration number is required",
      "error": "Bad Request"
    }
    ```
  - **Code**: 404 Not Found
    - If car with the given registration number is not found
    ```json
    {
      "statusCode": 404,
      "message": "Car with registration number ABC123 not found",
      "error": "Not Found"
    }
    ```

- **cURL Example**:
  ```bash
  curl -X GET "http://localhost:3000/slot?registration_number=ABC123"
  ```

#### 3.4 Get Slot Numbers by Color

Finds all slot numbers where cars of a specific color are parked.

- **Endpoint**: `GET /slots/color/:color`
- **URL Parameters**:

  | Parameter | Type | Required | Description |
  |-----------|------|----------|-------------|
  | `color` | string | Yes | Color of cars to search for |

- **Success Response**:
  - **Code**: 200 OK
  - **Content Example**:
    ```json
    {
      "color": "blue",
      "slot_numbers": [2, 4, 6]
    }
    ```

- **Error Responses**:
  - **Code**: 404 Not Found
    - If no cars of the specified color are found
    ```json
    {
      "statusCode": 404,
      "message": "No cars found with color: blue",
      "error": "Not Found"
    }
    ```

- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/slots/color/blue
  ```

## Data Models

### Car

```typescript
{
  reg_no: string;   // Registration number of the car
  color: string;    // Color of the car
}
```

### Response Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - The request has succeeded |
| 201 | Created - The request has been fulfilled and resulted in a new resource being created |
| 400 | Bad Request - The server could not understand the request due to invalid syntax or missing parameters |
| 404 | Not Found - The server cannot find the requested resource |
| 500 | Internal Server Error - The server has encountered a situation it doesn't know how to handle |

## Error Handling

All API endpoints return standardized error responses in the following format:

```json
{
  "statusCode": 400,
  "message": "Error message describing what went wrong",
  "error": "Error type (e.g., Bad Request, Not Found)"
}
```

## Usage Examples

### Complete Flow Example

1. Create a parking lot with 3 slots:
```bash
curl -X POST http://localhost:3000/parking_lot -H "Content-Type: application/json" -d '{"no_of_slot": 3}'
```

2. Park three cars:
```bash
curl -X POST http://localhost:3000/park -H "Content-Type: application/json" -d '{"reg_no": "ABC123", "color": "Red"}'
curl -X POST http://localhost:3000/park -H "Content-Type: application/json" -d '{"reg_no": "DEF456", "color": "Blue"}'
curl -X POST http://localhost:3000/park -H "Content-Type: application/json" -d '{"reg_no": "GHI789", "color": "Red"}'
```

3. Check status:
```bash
curl -X GET http://localhost:3000/status
```

4. Find all red cars:
```bash
curl -X GET http://localhost:3000/registration_numbers/color/red
```

5. Clear a slot:
```bash
curl -X POST http://localhost:3000/clear -H "Content-Type: application/json" -d '{"slot_number": 2}'
```

6. Expand parking lot:
```bash
curl -X PATCH http://localhost:3000/parking_lot -H "Content-Type: application/json" -d '{"increment_slot": 2}'
```