const express = require("express");
const { request, response } = require("express");
const app = express();
app.use(express.json());
const morgan = require("morgan");
app.use(express.static("build"));

const cors = require("cors");
app.use(cors());

morgan.token("body", (req, res) => {
  JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
  )
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.send(persons);
});

app.get("/info", (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people </p>
    <p> ${new Date()} </p>
    `);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => {
    return person.id === id;
  });
  if (person) {
    response.send(person);
  } else {
    response.send(400).end();
  }
});

const generateId = () => {
  return Math.floor(Math.random() * 100);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  } else if (persons.map((person) => person.name).includes(body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: String(body.number),
  };

  persons = persons.concat(person);
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
