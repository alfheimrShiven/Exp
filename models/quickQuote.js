// Dependencies
const mongoose = require('mongoose')

// Schema
const quickQuoteSchema = mongoose.Schema({
    quickQuoteRequest: {
        contract: {
            insuranceProductCode: {
                type: Number
            },
            startDate: {
                type: Date
            },
            endDate: {
                type: Date
            },
            term: {
                type: Number
            },
            salesChannel: {
                type: String
            },
            questions: {
                wantTrailerInsured: {
                    type: Boolean
                },
                employeesInsured: {
                    type: Number
                },
                driversInsured: {
                    type: Number
                },
                nonFarePassengersInsured: {
                    type: Number
                }
            },
            coverages: {
                baseCover: {
                    thirdPartyLiabilityCover: {
                        selection: {
                            type: Boolean
                        },
                        insuredAmount: {
                            type: Number
                        }
                    },
                    ownDamageCover: {
                        selection: {
                            type: Boolean
                        },
                        plan: {
                            type: String
                        },
                        discountPercent: {
                            type: Number
                        }
                    },
                    theftCover: {
                        selection: {
                            type: Boolean
                        }
                    },
                    fireCover: {
                        selection: {
                            type: Boolean
                        }
                    }
                },
                addOnCover: {
                    partsDepreciationCover: {
                        selection: {
                            type: Boolean
                        },
                        plan: {
                            type: String
                        },
                        numberOfClaimsCovered: {
                            type: String
                        },
                        coPay: {
                            type: Number
                        }
                    },
                    engineAndGearBoxProtectionCover: {
                        selection: {
                            type: Boolean
                        }
                    },
                    consumableCover: {
                        selection: {
                            type: Boolean
                        }
                    },
                    breakdownAssistanceCover: {
                    selection: {
                        type: Boolean
                    },
                        plan: {
                            type: String
                        }
                    },
                    returnToInvoiceCover: {
                        selection: {
                            type: Boolean
                        },
                        insuredAmount: {
                            type: Number
                        }
                    },
                    tyreProtectCover: {
                        selection: {
                            type: Boolean
                        },
                        insuredAmount: {
                            type: Number
                        }
                    },
                    rimDamageCover: {
                        selection: {
                            type: Boolean
                        },
                        insuredAmount: {
                            type: Number
                        }
                    }
                },
                additionalCover: {
                    otherDriverCover: {
                        selection: {
                            type: Boolean
                        },
                        insuredAmount: {
                            type: Number
                        }
                    },
                    paUnnamedPersonCover: {
                        selection: {
                            type: Boolean
                        },
                        insuredAmount: {
                            type: Number
                        }
                    },
                    paOwnerDriverCover: {
                        selection: {
                            type: Boolean
                        },
                        insuredAmount: {
                            type: Number,
                        }
                    }
                },
                accessoriesCover: {
                    electricalCover: {
                        selection: {
                            type: Boolean
                        },
                        insuredAmount: {
                            Number
                        }
                    },
                    nonElectricalCover: {
                        selection: {
                            type: Boolean
                        },
                        insuredAmount: {
                            type: Number
                        }
                    },
                    cngCover: {
                        selection: {
                            type: Boolean
                        },
                        insuredAmount: {
                            type: Number
                        }
                    }
                }
            },
            voluntaryDeductible: {
                type: String
            }
        },
        vehicle: {
            isVehicleNew: {
                type: Boolean
            },
            idv: {
                type: Number
            },
            annualMileage: {
                type: Number
            },
            mainCode: {
                type: Number,
            },
            licensePlate: {
                type: String
            },
            vehicleIdentificationNumber: {
                type: String
            },
            engineNumber: {
                type: String
            },
            permitAgency: {
                type: String
            },
            manufactureDate: {
                type: Date
            },
            initialRegistrationDate: {
                type: Date
            },
            permitUsageType: {
                type: String
            },
            vehicleType: {
                type: String
            },
            usageType: {
                type: String
            },
            trailer: {
                type: String
            },
            hypothecation: {
                isHypothecation: {
                    type: Boolean
                },
                hypothecationAgency: {
                    type: String
                },
                hypothecationCIty: {
                    type: String
                }
            }
        },
        previousInsurer: {
            previousInsurerCode: {
                type: Number
            },
            previousInsurerPolicyNumber: {
                type: String
            },
            previousInsurerPolicyExpiryDate: {
                type: Date
            },
            claimInLastYear: {
                type: Boolean
            },
            previousNoClaimBonus: {
                type: String
            }
        },
        pinCode: {
            type: Number
        },
        enquiryId: {
            type: String
        },
        security: {
            webUserId: {
                type: String,
                default: "25860711"
            },
            password: {
                type: String,
                default: "digit123"
            }
        }
    },
    user: {
        phone: {
            type: Number,
        },
        name: {
            type: String,
        }
    },
    call: {
        type: Boolean,
        default: false
    }
})

const quickQuote = module.exports = mongoose.model('quickQuote', quickQuoteSchema)
