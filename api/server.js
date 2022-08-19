import express from 'express'
import {router} from './routes'
import cors from 'cors'

const app = express()

app.use(cors())

const port = process.env.PORT || 80

app.use(express.json())

app.use(router)


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
  