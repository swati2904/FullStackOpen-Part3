require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(express.static("build"));
app.use(cors());

morgan.token("body", (req, res) => {
  JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
  )
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.send(persons);
  });
});

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    response.send(
      `<div> 
        <p>Phonebook has info for ${persons.length} people </p>
        <p> ${new Date()} </p>
      </div>`
    );
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) response.json(person);
      else response.status(404).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const { name = "", number = 0 } = request.body;
  if (!name || !number) {
    response.status(404).send({
      error: "Name or / and number is missing",
    });
  }
  const person = new Person({ name, number });
  person
    .save()
    .then((savedPerson) => {
      response.status(201).send(savedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  response.status(204).end();
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/perons/:id", (request, response, next) => {
  const { name = "", number = 0 } = request.body;
  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true })
    .then((savedPerson) => {
      response.status(201).send(savedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
