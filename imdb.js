const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");
const xlsx = require("xlsx");
const csv = require("csv-parser");

// MySQL connection setup
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "imdb",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database.");
});

// Function to convert date to yyyy-mm-dd format
function formatDate(dateStr) {
  if (!dateStr) return null;

  let date;

  // Handle yyyy format
  if (/^\d{4}$/.test(dateStr)) {
    return `${dateStr}-01-01`; // Default to January 1st
  }

  // Handle dd-mm-yyyy or mm/dd/yyyy format
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    // dd-mm-yyyy
    const [day, month, year] = dateStr.split("-");
    date = new Date(`${year}-${month}-${day}`);
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    // mm/dd/yyyy
    const [month, day, year] = dateStr.split("/");
    date = new Date(`${year}-${month}-${day}`);
  } else {
    // Try parsing with default formats
    date = new Date(dateStr);
  }

  if (isNaN(date.getTime())) return null;

  return date.toISOString().split("T")[0];
}

// Accumulate rows for batch insertion
const batchSize = 1000; // Adjust batch size according to your needs and database capacity
const rows = [];

// Function to insert rows into the MySQL table in batches
function insertBatch(tableName, batch) {
  let query;
  let values;

  switch (tableName) {
    case "names":
      query =
        "INSERT INTO names (id, name, height, date_of_birth, known_for_movies) VALUES ?";
      values = batch.map((row) => [
        row.id || null,
        row.name || null,
        isNaN(parseInt(row.height)) ? null : parseInt(row.height),
        formatDate(row.date_of_birth),
        row.known_for_movies || null,
      ]);
      break;

    case "movies":
      query =
        "INSERT INTO movies (id, title, year, date_published, duration, country, worldwide_gross_income, languages, production_company) VALUES ?";
      values = batch.map((row) => [
        row.id || null,
        row.title || null,
        isNaN(parseInt(row.year)) ? null : parseInt(row.year),
        formatDate(row.date_published),
        isNaN(parseInt(row.duration)) ? null : parseInt(row.duration),
        row.country || null,
        row.worldwide_gross_income || null,
        row.languages || null,
        row.production_company || null,
      ]);
      break;

    case "director_mapping":
      query = "INSERT INTO director_mapping (movie_id, name_id) VALUES ?";
      values = batch.map((row) => [row.movie_id || null, row.name_id || null]);
      break;

    case "ratings":
      query =
        "INSERT INTO ratings (movie_id, avg_rating, total_votes, median_rating) VALUES ?";
      values = batch.map((row) => [
        row.movie_id || null,
        isNaN(parseFloat(row.avg_rating)) ? null : parseFloat(row.avg_rating),
        isNaN(parseInt(row.total_votes)) ? null : parseInt(row.total_votes),
        isNaN(parseFloat(row.median_rating))
          ? null
          : parseFloat(row.median_rating),
      ]);
      break;

    case "genre":
      query = "INSERT INTO genre (movie_id, genre) VALUES ?";
      values = batch.map((row) => [row.movie_id || null, row.genre || null]);
      break;

    case "role_mapping":
      query = "INSERT INTO role_mapping (movie_id, name_id, category) VALUES ?";
      values = batch.map((row) => [
        row.movie_id || null,
        row.name_id || null,
        row.category || null,
      ]);
      break;

    default:
      console.error("Unknown table name:", tableName);
      return;
  }

  connection.query(query, [values], (err, results) => {
    if (err) {
      console.error(`Error inserting batch into ${tableName}:`, err);
    } else {
      console.log(`Batch inserted into ${tableName}.`);
    }
  });
}

// Function to process files
function processFile(filePath, tableName) {
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      rows.push(row);
      if (rows.length >= batchSize) {
        insertBatch(tableName, rows.splice(0, batchSize));
      }
    })
    .on("end", () => {
      if (rows.length > 0) {
        insertBatch(tableName, rows); // Insert remaining rows
      }
      console.log(`${tableName} file processing completed.`);
      connection.end();
    });
}

// Function to process Excel files
function processExcel(filePath, tableName) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  data.forEach((row) => {
    rows.push(row);
    if (rows.length >= batchSize) {
      insertBatch(tableName, rows.splice(0, batchSize));
    }
  });

  if (rows.length > 0) {
    insertBatch(tableName, rows); // Insert remaining rows
  }

  console.log(`${tableName} file processing completed.`);
  connection.end();
}

// Main function to choose file type and process
function main() {
  const filePath = process.argv[2]; // File path passed as a command-line argument
  const tableName = process.argv[3]; // Table name passed as a command-line argument

  if (!filePath || !tableName) {
    console.error("Please provide a file path and table name.");
    return;
  }

  const extname = path.extname(filePath).toLowerCase();
  console.log(`File extension: ${extname}`); // Debugging line to check file extension

  if (extname === ".csv") {
    processFile(filePath, tableName);
  } else if (extname === ".xlsx") {
    processExcel(filePath, tableName);
  } else {
    console.error("Unsupported file type.");
  }
}

main();
