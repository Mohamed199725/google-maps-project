const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection options
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// MongoDB Atlas connection URI from environment variable
const uri = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose.connect(uri, options)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        // Call functions to perform database operations
        createAndSavePerson();
        createManyPeople();
        findPeopleByName('John');
        findOnePersonByFood('Pizza');
        findPersonById('607c5200c293a05a682c49f7');
        findEditThenSave('607c5200c293a05a682c49f7');
        findAndUpdate('John');
        removeById('607c5200c293a05a682c49f7');
        removeMary();
        chainSearchQuery();
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error);
    });

// Define a person schema
const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number },
    favoriteFoods: { type: [String] }
});

// Create a Person model
const Person = mongoose.model('Person', personSchema);

// Function to create and save a record of a model
async function createAndSavePerson() {
    try {
        const person = new Person({ name: 'John', age: 30, favoriteFoods: ['Pizza', 'Burger'] });
        const savedPerson = await person.save();
        console.log('Person saved:', savedPerson);
    } catch (error) {
        console.error('Error saving person:', error);
    }
}

// Function to create many records with model.create()
async function createManyPeople() {
    const arrayOfPeople = [
        { name: 'Alice', age: 25, favoriteFoods: ['Sushi', 'Pasta'] },
        { name: 'Bob', age: 35, favoriteFoods: ['Steak', 'Salad'] }
    ];
    try {
        const savedPeople = await Person.create(arrayOfPeople);
        console.log('Multiple people saved:', savedPeople);
    } catch (error) {
        console.error('Error saving multiple people:', error);
    }
}

// Function to find all people having a given name
async function findPeopleByName(personName) {
    try {
        const people = await Person.find({ name: personName });
        console.log('People found by name:', people);
    } catch (error) {
        console.error('Error finding people by name:', error);
    }
}

// Function to find just one person which has a certain food in the person's favorites
async function findOnePersonByFood(food) {
    try {
        const person = await Person.findOne({ favoriteFoods: food });
        console.log('Person found by food:', person);
    } catch (error) {
        console.error('Error finding person by food:', error);
    }
}

// Function to find a person by _id
async function findPersonById(personId) {
    try {
        const person = await Person.findById(personId);
        console.log('Person found by ID:', person);
    } catch (error) {
        console.error('Error finding person by ID:', error);
    }
}

// Function to perform classic updates by running find, edit, then save
async function findEditThenSave(personId) {
    try {
        const person = await Person.findById(personId);
        if (!person) {
            console.log('Person not found with ID:', personId);
            return;
        }
        person.favoriteFoods.push('Hamburger');
        const updatedPerson = await person.save();
        console.log('Person updated:', updatedPerson);
    } catch (error) {
        console.error('Error updating person:', error);
    }
}
// Function to perform new updates on a document using model.findOneAndUpdate()
async function findAndUpdate(personName) {
    try {
        const updatedPerson = await Person.findOneAndUpdate({ name: personName }, { age: 20 }, { new: true });
        console.log('Person updated by name:', updatedPerson);
    } catch (error) {
        console.error('Error updating person by name:', error);
    }
}

// Function to delete one document using model.findByIdAndRemove
async function removeById(personId) {
    try {
        const removedPerson = await Person.findOneAndDelete({ _id: personId });
        console.log('Person removed:', removedPerson);
    } catch (error) {
        console.error('Error removing person by ID:', error);
    }
}

// Function to delete many documents with model.remove()
async function removeMary() {
    try {
        const result = await Person.deleteMany({ name: 'Mary' });
        console.log('People named Mary removed:', result);
    } catch (error) {
        console.error('Error removing people named Mary:', error);
    }
}

// Function to chain search query helpers
async function chainSearchQuery() {
    try {
        const people = await Person.find({ favoriteFoods: 'burritos' })
            .sort({ name: 1 }) // Sort by name in ascending order
            .limit(2) // Limit the results to 2 documents
            .select({ name: 1 }); // Only include the name field

        console.log('People who like burritos:', people);
    } catch (error) {
        console.error('Error searching for people who like burritos:', error);
    }
}

// Listen on the specified port
const PORT = process.env.PORT || 3000;
mongoose.connection.once('open', () => {
    console.log(`Connected to MongoDB Atlas`);
    console.log(`Server is running on port ${PORT}`);
});