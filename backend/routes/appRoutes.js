module.exports = app => {
    let invoiceData = [
        {
            "invoiceId": 1234,
            "vendorId": "G1",
            "quantity": 20,
            "product": "Apple",
            "amountBal": 129.92,
            "amountDue": 25.50,
            "invoiceDate": "04 / 01 / 2020"
        },
        {
            "invoiceId": 4578,
            "vendorId": "Delmonte",
            "product": "B1",
            "quantity": 500,
            "amountBal": 1024.12,
            "amountDue": 512.50,
            "invoiceDate": "03 / 31 / 2020"
        },
        {
            "invoiceId": 9999,
            "vendorId": "W1",
            "quantity": 1000,
            "product": "Napkin",
            "amountBal": 12.25,
            "amountDue": 12.25,
            "invoiceDate": "03 / 31 / 2020"
        },
        {
            "invoiceId": 1000,
            "vendorId": "W1",
            "quantity": 25,
            "product": "Sanitizer",
            "amountBal": 25.00,
            "amountDue": 12.25,
            // "amountDue": 1000,
            "invoiceDate": "03 / 31 / 2020"
        },
        {
            "invoiceId": 1025,
            "vendorId": "W1",
            "quantity": 1000,
            "product": "Napkin",
            "amountBal": 0,
            "amountDue": 0,
            "invoiceDate": "03 / 31 / 2020"
        }
    ]

    let vendors = [
        {
            "vendorId": "D1",
            "vendorName": "Delmonte",
            "creditBal": 600.0
        },
        {
            "vendorId": "T1",
            "vendorName": "Target"
        },
        {
            "vendorId": "W1",
            "vendorName": "Walmart",
            "creditBal": 12.25
            // "creditBal": 1000.0
        },
        {
            "vendorId": "G1",
            "creditBal": 0.0
        }
    ]

    app.get("/", (req, res) => {
        res.send("Working Fine!!");
    });

    app.get("/invoices", async (req, res) => {
        res.send(invoiceData)
    })

    app.get("/vendors", async (req, res) => {
        res.send(vendors)
    })

    app.post("/credit/apply", async (req, res) => {
        let creditApplied = req.body.creditApplied
        let amount = req.body.creditAmount
        let vendor = req.body.vendor
        let invoice = req.body.invoice

        let vendorIndex = vendors.findIndex(obj => obj.vendorId === vendor.vendorId)
        let invoiceIndex = invoiceData.findIndex(obj => obj.invoiceId === invoice.invoiceId)

        if (vendorIndex != -1 && invoiceIndex != -1 && creditApplied) {
            vendors[vendorIndex].creditBal -= amount
            invoiceData[invoiceIndex].amountDue -= amount
        }

        res.send({ vendors, invoiceData, selectedInvoice: invoiceData[invoiceIndex], creditBal: vendors[vendorIndex].creditBal })
    })

    app.post("/payment", async (req, res) => {
        let payAmount = req.body.payAmount
        let creditUsed = req.body.creditUsed
        let vendor = req.body.vendor
        let invoice = req.body.invoice

        let vendorIndex = vendors.findIndex(obj => obj.vendorId === vendor.vendorId)
        let invoiceIndex = invoiceData.findIndex(obj => obj.invoiceId === invoice.invoiceId)

        if (vendorIndex != -1 && invoiceIndex != -1) {
            vendors[vendorIndex].creditBal -= payAmount
            invoiceData[invoiceIndex].amountDue -= payAmount
        }

        res.send({ vendors, invoiceData, selectedInvoice: invoiceData[invoiceIndex] })
    })

}