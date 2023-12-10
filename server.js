// Moduler, ramverk och bibliotek
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Product = require('./models/productModel');

const app = express();
//funktion med express


const htmlFilePath = path.join(__dirname, 'index.html');

const PORT = 3024;

//Länk till MongoDB Atlas-databasen
const DATABASE_URI = 'mongodb+srv://admin:123456admin@hannahapi.qnuesyy.mongodb.net/hannahtestar?retryWrites=true&w=majority';

// Express Middlewares
app.use(express.static(__dirname));
app.use(express.json());

// Funktion för att ansluta till MongoDB-Atlas-databasen
async function main() {
  await mongoose.connect(DATABASE_URI);
}

// Anropar main-funktionen för att kunna ansluta till cloud-databasen
main().catch(err => console.log(err));

// Routes //

//Startsidan
//när man får ett GET-anrop så är  det detta som ska köras
app.get('/', (req, res) => {
  res.sendFile(htmlFilePath);
});

//Produkter - samtliga produkter. Här kan man även söka på namn och filtrera ut
//först kollar vi om det finns någon query/söksträng ?name=
//om det finns söksträng = spara ner i variablen name. Omdet inte finns - spara ner tom sträng i name som matchar allt.
app.get('/api/products', async (req, res) => {
  try {
    const name = req.query.name || '';
    const products = await Product.find({ name: { $regex: name, $options: 'i' } });
    //regex (regular expressions, kolla för att matcha)

    if (!products.length) {
      return res.status(404).json({ message: `Cannot find any products` });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});


//Radera alla produkter
app.delete('/api/products/deleteall', async (req, res) => {
  try {
    //tar bort alla produkter, sparar resultatet i variabeln result
    const result = await Product.deleteMany();

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No products found to delete.' });
    }

    // Om allt gått strålande
    res.status(200).json({ message: 'All products deleted!' });
  } catch (error) {
    // Vid fel
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Produkter - filtrera produkter efter ID
app.get('/api/products/:id', async (req, res) => {
  try {
    // Hämta ID från URLen, parameter-ersättare
    const { id } = req.params;

    // Sök efter produkt med det specifika ID, sökresultatet sparas ner i product
    const product = await Product.findById(id);

    // Om ingen produkt hittades - returnera felstatus
    if (!product) {
      return res.status(404).json({ message: `Cannot find product with ID ${id}` });
    }

    // Annars skicka tillbaka information som JSON
    res.status(200).json(product);
  } catch (error) {
    // Vid fel, skicka felstatus med felmeddelande 500, något med databasen
    res.status(500).json({ message: error.message });
  }
});

// Lägga till produkter i databasen
app.post('/api/products', async (req, res) => {
  try {
    // Skapa en ny produkt baserad på JSON-data i förfrågan
    const product = await Product.create(req.body);

    // Skicka tillbaka den skapade produkten som JSON
    res.status(200).json(product);
  } catch (error) {
    // Vid fel, logga och skicka felstatus med felmeddelande
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Uppdatera produkt - ID
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    //mongoose-funktion
    const product = await Product.findByIdAndUpdate(id, req.body);

    // Om ingen produkt hittades, returnera felstatus 404
    if (!product) {
      return res.status(404).json({ message: `Cannot find product with ID ${id}` });
    }

    // Hämta den uppdaterade produkten och skicka tillbaka som JSON
    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ta bort produkt mha ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: `Cannot find any product with ID ${id}` });
    }
    res.status(200).json({ message: `Product ${id} is now deleted maddafakka!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Servern ligger och puttrar i bakgrunden och väntar på anrop, som den sedan jämför med routsen som finns. 
//Skriver ut console.log mest för att se - evig loop
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

