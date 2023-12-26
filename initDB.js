const mongoose = require('mongoose');
const contribTypeModel = require('./models/contribType');
const Post = require('./models/Post');

const contribType = [
  {
    name: 'Transport',
    description: 'Indica els kilometres realitzats',
    unit: 'Kilometre',
  },
  {
    name: 'Reciclar',
    description: 'Indica la quantitat de material reciclat',
    unit: 'Kilogram',
  },
  {
    name: 'Aigua',
    description: 'Indica els litres consumits',
    unit: 'Litre',
  },
  {
    name: 'Electricitat',
    description: 'Indica els Watts consumits',
    unit: 'Watt',
  },
];

const contrib = [
  {
    name: 'Transport fins feina',
    description: '',
    tipus: 'Transport',
    quantitat: '12',
    unitat: 'Kilometre',
  },
  {
    name: 'Reciclatge deixalles',
    description: '',
    tipus: 'Reciclar',
    quantitat: '2',
    unitat: 'Kilogram',
  },
  {
    name: 'Aigua dutxa',
    description: '',
    tipus: 'Aigua',
    quantitat: '23',
    unitat: 'Litre',
  },
  {
    name: 'Electricitat televisió',
    description: '',
    tipus: 'Electricitat',
    quantitat: '230',
    unitat: 'Watt',
  },
];

const init = async (collectionName, data, model) => {
  const collection = mongoose.model(collectionName);
  const count = await collection.countDocuments();
  if (count === 0) {
    data.forEach(function (seed) {
      model.create(seed, function (err, model) {
        if (err) {
          console.log(err);
        } else {
          console.log('new ' + collection + ' added');
        }
      });
    });
  }
};

const initDB = async () => {
  try {
    mongoose.model('posts', Post.schema);
    await init('contribtypes', contribType, contribTypeModel);
    await init('posts', contrib, Post);
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

module.exports = initDB;
