require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());
app.use(express.static("build"));

const cors = require("cors");
const Person = require("./models/person");
app.use(cors());

morgan.token("body", (req, res) => {
  JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
  )
);

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.send(persons);
  });
});

app.get("/info", (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people </p>
    <p> ${new Date()} </p>
    `);
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.post("/api/persons", (request, response) => {
  const { name = "", number = 0 } = request.body;
  if (!name || !number) {
    response.status(404).send({
      error: "Name or / and number is missing",
    });
  }
  const person = new Person({ name, number });
  person.save().then((savedPerson) => {
    response.status(201).send(savedPerson);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
