const makeApp = require('./server')
makeApp()
.then(app => app.listen(8085))
.then(() => {
  console.log('Server started')
})
.catch(err => {
  console.error('caught error', err)
})