const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password> to list all the elements"
  );
  console.log(
    "Please provide the password with the contact info to add a person: node mongo.js <password> <name> <number>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://swati_2904:${password}@cluster0.nbybs.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach(({ name, number }) => {
      console.log(`${name} ${number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name,
    number,
  });

  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
