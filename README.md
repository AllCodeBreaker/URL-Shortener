# URL Shortener

A simple and efficient URL shortener application built with Flask, SQLAlchemy, and MySQL.

## Features

- **Shorten URLs**: Convert long URLs into short, shareable links
- **Redirect**: Short links automatically redirect to the original URLs
- **Beautiful UI**: Modern, responsive frontend with real-time feedback
- **Database Storage**: All shortened URLs are stored in MySQL for persistence

## Installation

### Prerequisites
- Python 3.8+
- MySQL server (or Aiven MySQL)
- Virtual environment

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo>
   cd URL-Shortener
   ```

2. **Create and activate virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration:
   ```env
   DATABASE_URL=mysql://username:password@host:3306/database_name
   BASE_URL=http://127.0.0.1:5000
   ```

5. **Initialize the database**
   ```bash
   python3 app.py
   ```
   Then open `http://127.0.0.1:5000/init` in your browser

## Running the Application

```bash
python3 app.py
```

The application will be available at `http://127.0.0.1:5000`

## Deployment Configuration

### Environment Variables

- **DATABASE_URL**: MySQL connection string (required)
  - Format: `mysql://username:password@host:port/database`
  - Aiven format: `mysql://username:password@host:port/database?sslmode=require`

- **BASE_URL**: Base URL for shortened links (optional, defaults to `http://127.0.0.1:5000`)
  - For local development: `http://127.0.0.1:5000`
  - For Heroku: `https://your-app-name.herokuapp.com`
  - For Railway: `https://your-app-name.up.railway.app`
  - For custom domain: `https://yourdomain.com`

### Example Deployment URLs

#### Heroku
```env
DATABASE_URL=mysql://user:pass@host.aivencloud.com:21234/dbname
BASE_URL=https://my-url-shortener.herokuapp.com
```

#### Railway
```env
DATABASE_URL=mysql://user:pass@host.railway.internal:3306/dbname
BASE_URL=https://my-url-shortener.up.railway.app
```

#### Custom Domain
```env
DATABASE_URL=mysql://user:pass@mysql.example.com:3306/urls
BASE_URL=https://short.example.com
```

## API Endpoints

### GET `/`
Serves the main web interface

### POST `/shorten`
Shortens a URL
- **Request body:**
  ```json
  {
    "url": "https://www.example.com/very/long/url"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "short_url": "abc123",
    "shortened_url": "http://127.0.0.1:5000/abc123"
  }
  ```

### GET `/<code>`
Redirects to the original URL

### GET `/health`
Health check endpoint

### GET `/init`
Initialize the database (creates tables)

## Frontend

The frontend is built with HTML, CSS, and vanilla JavaScript:
- **Responsive design** - Works on desktop and mobile
- **Real-time validation** - URL validation before submission
- **Copy to clipboard** - Easy sharing of shortened URLs
- **Error handling** - Clear error messages for invalid inputs

## Project Structure

```
URL-Shortener/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── .env.example          # Environment configuration template
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── style.css         # Styling
    └── script.js         # Frontend logic
```

## Technologies Used

- **Backend**: Flask, Flask-SQLAlchemy, PyMySQL
- **Database**: MySQL
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Deployment**: Can be deployed to Heroku, Railway, AWS, or any Python-supporting platform

## License

MIT License - feel free to use this project for personal or commercial purposes

## Support

For issues or questions, please open an issue in the repository.
