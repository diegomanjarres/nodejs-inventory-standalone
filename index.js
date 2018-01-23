const app = require('express')()
const bodyParser = require('body-parser')
const NodejsInventory = require('nodejs-inventory')
const Monitor = require('nodejs-inventory-monitor')
const inventory = new NodejsInventory()
const monitor = new Monitor(inventory)

const databaseConnection = process.env.DATABASE || 'mongodb://localhost:27017/nodejs-inventory'

inventory.connect(databaseConnection)
monitor.connect(databaseConnection)
inventory.startMonitor(monitor)

app.use(bodyParser.json())

app.use((req, res, next) => {
  req.user = {
    _id: req.headers.user
  }
  req.query.user = req.user
  next()
})
app.use('/', inventory.allRoutes)
app.post('/monitorConfig',(req,res)=>{
  monitor.saveItemMonitorConfig(req.body)
    .then(data=>res.send(data))
})

app.listen(process.env.PORT || 8000)
console.log('running');
