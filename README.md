# Koinx Backend

A simple backend application that fetches cryptocurrency data from CoinGecko and stores it in a MongoDB database. It also provides an API to fetch the latest cryptocurrency statistics and the standard deviation of the price of a given cryptocurrency.

## Features

- **Background Job**: Fetches the current price in USD, market cap in USD, and 24-hour change of 3 cryptocurrencies: Bitcoin, Matic, and Ethereum every 2 hours and stores it in a database.
- **API `/stats`**: Returns the latest data about the requested cryptocurrency.
- **API `/deviation`**: Returns the standard deviation of the price of the requested cryptocurrency for the last 100 records stored by the background service in the database.

## Acess the API

The API is available at: [koinxapi.devprojects.world](https://koinxapi.devprojects.world).



## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/royaals/koinx-backend.git
    cd koinx-backend
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root directory and add the following:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    COINGECKO_API_URL=https://api.coingecko.com/api/v3
    ```

4. **Run the application**:
    ```bash
    npm start
    ```
## API Documentation
Access the interactive API documentation at:
```bash
http://localhost:3000/api-docs

```

## Usage

### Task 1: Background Job

- The background job runs every 2 hours to fetch and store cryptocurrency data from CoinGecko.

### Task 2: API `/stats`

- **Endpoint**: `/stats`
- **Method**: GET
- **Query Params**:
    ```json
    {
        "coin": "bitcoin" // Could be one of the above 3 coins
    }
    ```
- **Sample Response**:
    ```json
    {
        "price": 40000,
        "marketCap": 800000000,
        "24hChange": 3.4
    }
    ```

### Task 3: API `/deviation`

- **Endpoint**: `/deviation`
- **Method**: GET
- **Query Params**:
    ```json
    {
        "coin": "bitcoin" // Could be one of the above 3 coins
    }
    ```
- **Sample Response**:
    ```json
    {
        "deviation": 4082.48
    }
    ```

