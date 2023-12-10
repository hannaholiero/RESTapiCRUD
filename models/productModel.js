const mongoose = require('mongoose');
const productsTable = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: false
    }
  },
)

const Product = mongoose.model('Product', productsTable);

module.exports = Product;

