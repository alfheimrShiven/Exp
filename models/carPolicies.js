// Dependencies
const mongoose = require('mongoose')

const carPolicy = new mongoose.Schema({
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  quoteNumber: {
    type: String,
    unique: true
  },
  plan: {
    date: {
      to: {
        type: Date
      },
      from: {
        type: Date
      }
    },
    discountCurrentPolicy: {
      type: Number
    },
    coveraged: [String],
    addOns: [String],
    deduct: {
      type: Number
    },
    invoice: {
      type: String
    }
  },
  premium: {
    ownDamage: {
      ownDamagePremium: {
        type: Number
      },
      addOns: {
        type: Number
      },
      discount: {
        type: Number
      }
    },
    liabilityPremium: {
      basicThirdParty: {
        type: Number
      },
      coverForOwner: {
        type: Number
      },
      legalOperation: {
        type: Number
      },
      biFuelKit: {
        tpye: Number
      },
      coverPassengers: {
        tpye: Number
      },
      legalLiabilityPaidDriver: {
        type: Number
      }
    },
    user: {
      phone: {
        type: Number,
        required: true
      }
    }
  }
})

carPolicy = module.exports = mongoose.model('carPolicy', carPolicySchema)